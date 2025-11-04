import { useState, useEffect, useMemo } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import { TimeSlot, Trainee, BatchFilter } from './types/types.ts';
import SlotCard from './components/SlotCard';
import CreateSlotModal from './components/CreateSlotModal';
import FilterBar from './components/FilterBar';
import StatsCard from './components/StatsCard';
import { Plus, Car, LogOut, Users } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import TraineePage from './components/TraineePage';
import { getDay, format, formatISO } from 'date-fns';
import DayPicker from './components/DayPicker';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState('home'); // 'home', 'login', 'register'
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<BatchFilter>({ availability: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allTrainees, setAllTrainees] = useState<Trainee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Defaults to today
  const [slotsUpdated, setSlotsUpdated] = useState(0);

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        // Get error message from backend
        const data = await response.json();
        alert(data.msg || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Is the backend server running?');
    }
  };
  
  
// --- REPLACE OLD handleLogout WITH THIS ---
  const handleLogout = async () => {
    try {
      // Tell the backend to clear the cookie
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always log out the frontend regardless of backend success
      setIsLoggedIn(false);
      setPage('home');
    }
  };
  // --- END OF REPLACEMENT ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // Done checking, show the app
      }
    };
    checkAuth();
  }, []); // The empty array [] means it runs only once

useEffect(() => {
    if (isLoggedIn) {
      const fetchSlots = async () => {
        try {
          const formattedDate = formatISO(selectedDate, { representation: 'date' });
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slots?date=${formattedDate}`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            const formattedSlots = data.map((slot: any) => ({
              ...slot,
              id: slot._id,
              trainees: slot.trainees.map((t: any) => ({ ...t, id: t._id }))
            }));
            setSlots(formattedSlots);
          } else {
            console.error('Failed to fetch slots');
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      };

      const fetchTrainees = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainees`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            const formattedTrainees = data.map((trainee: any) => ({
              ...trainee,
              id: trainee._id
            }));
            setAllTrainees(formattedTrainees);
          } else {
            console.error('Failed to fetch trainees');
          }
        } catch (error) {
          console.error('Error fetching trainees:', error);
        }
      };

      fetchSlots();
      fetchTrainees();
    }
  }, [isLoggedIn, selectedDate, slotsUpdated]); // ADD slotsUpdated here
  
  const handleCreateSlot = async (startTime: string, endTime: string, dayOfWeek: number) => {
    try {
      const date = formatISO(selectedDate, { representation: 'date' }); 
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date, 
          startTime,
          endTime,
          maxTrainees: 2 
        }),
      });
      
      if (response.status === 201) {
        // SUCCESS: Force the main useEffect to run again to fetch the new list
        setSlotsUpdated(prev => prev + 1); 
      } else {
        const data = await response.json();
        alert(`Failed to create slot: ${data.msg}`);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };
  // --- ADD THIS NEW FUNCTION ---
  const handleAddTrainee = async (slotId: string, traineeId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slots/${slotId}/trainees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ traineeId }),
      });

      if (response.ok) {
        const updatedSlot = await response.json();
        // Update the 'slots' state with the new slot data
        setSlots(prevSlots => 
          prevSlots.map(slot => 
            slot.id === slotId ? { 
              ...updatedSlot, 
              id: updatedSlot._id, 
              // --- THIS IS THE FIX ---
              trainees: updatedSlot.trainees.map((t: any) => ({ ...t, id: t._id }))
            } : slot
          )
        );
      } else {
        const data = await response.json();
        alert(`Failed to add trainee: ${data.msg}`);
      }
    } catch (error) {
      console.error('Error adding trainee to slot:', error);
    }
  };

  // --- ADD THIS NEW FUNCTION ---
  const handleRemoveTrainee = async (slotId: string, traineeId: string) => {
    if (!window.confirm('Are you sure you want to remove this trainee from the slot?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slots/${slotId}/trainees/${traineeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedSlot = await response.json();
        // Update the 'slots' state with the new slot data
        setSlots(prevSlots => 
          prevSlots.map(slot => 
            slot.id === slotId ? { 
              ...updatedSlot, 
              id: updatedSlot._id,
              // --- THIS IS THE FIX ---
              trainees: updatedSlot.trainees.map((t: any) => ({ ...t, id: t._id }))
            } : slot
          )
        );
      } else {
        alert('Failed to remove trainee.');
      }
    } catch (error) {
      console.error('Error removing trainee from slot:', error);
    }
  };

  // --- NEW DELETE FUNCTION ---
  const handleDeleteSlot = async (slotId: string) => {
    // This is the popup you asked for (using window.confirm)
    if (window.confirm('Are you sure you want to remove this slot?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slots/${slotId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Because we fixed the 'id' prop, this filter now works
          setSlots(prev => prev.filter(slot => slot.id !== slotId));
        } else {
          alert('Failed to delete slot.');
        }
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };
  // --- End of new function ---
  // ... (after handleDeleteSlot)

// --- ADD THIS FUNCTION ---
const handleAddNewTrainee = async (newTrainee: { name: string, phone: string, email: string }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify(newTrainee),
    });

    if (response.status === 201) {
      const addedTrainee = await response.json();
      // Add the new trainee (with its DB _id) to our state
      setAllTrainees(prev => [...prev, { ...addedTrainee, id: addedTrainee._id }]);
    } else {
      const data = await response.json();
      alert(`Failed to add trainee: ${data.msg}`);
    }
  } catch (error) {
    console.error('Error adding trainee:', error);
  }
};

// --- AND ADD THIS FUNCTION ---
const handleDeleteTrainee = async (traineeId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainees/${traineeId}`, {
      method: 'DELETE',
      credentials: 'include', // Send cookies
    });

    if (response.ok) {
      // Remove the trainee from our local state
      setAllTrainees(prev => prev.filter(trainee => trainee.id !== traineeId));
    } else {
      alert('Failed to delete trainee.');
    }
  } catch (error) {
    console.error('Error deleting trainee:', error);
  }
};

const filteredSlots = useMemo(() => {
    // Backend handles date filtering, so we only need to sort by time 
    // and apply local search/availability filters.
    const slotsToFilter = [...slots].sort((a: any, b: any) => 
      a.startTime.localeCompare(b.startTime)
    );
    
    return slotsToFilter.filter(slot => {
      const availableSpots = slot.maxTrainees - slot.trainees.length;

      if (filter.availability === 'available' && availableSpots === 0) {
        return false;
      }
      if (filter.availability === 'full' && availableSpots > 0) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatchingTrainee = slot.trainees.some((trainee: any) =>
          trainee.name.toLowerCase().includes(searchLower) ||
          trainee.phone.includes(searchTerm) ||
          (trainee.email && trainee.email.toLowerCase().includes(searchLower))
        );
        if (!hasMatchingTrainee) {
          return false;
        }
      }

      return true;
    });
  }, [slots, filter, searchTerm]);


  const stats = useMemo(() => {
    const totalSlots = slots.length;
    const totalTrainees = slots.reduce((sum, slot) => sum + slot.trainees.length, 0);
    const availableSlots = slots.filter(slot => slot.trainees.length < slot.maxTrainees).length;
    const fullSlots = slots.filter(slot => slot.trainees.length >= slot.maxTrainees).length;
    
    return { totalSlots, totalTrainees, availableSlots, fullSlots };
  }, [slots]);

  // Show a blank loading screen while we check auth
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" />;
  }


  if (!isLoggedIn) {
    if (page === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }
    return <HomePage onShowLogin={() => setPage('login')}/>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity"> 
              <div className="p-2 bg-blue-600 rounded-lg">
                <Car className="w-8 h-8 text-blue-100" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                  GearSlot
                </h1>
                <p className="text-sm text-white">Slot Management System</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Slot
              </button>
              <Link
                to="/trainees"
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Trainees
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* ... (your </header> tag) ... */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={
            <>
              <StatsCard {...stats} />
              {/* We are no longer using the old FilterBar */}

              {/* --- NEW 2-COLUMN LAYOUT --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">

                {/* --- 1. LEFT COLUMN (Slots) --- */}
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold">
                    Slots for: {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                  </h2>
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map(slot => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        allTrainees={allTrainees}
                        onAddTrainee={handleAddTrainee}
                        onRemoveTrainee={handleRemoveTrainee}
                        onDeleteSlot={handleDeleteSlot}
                      />
                    ))
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                      No slots available for this day.
                    </div>
                  )}
                </div>

                {/* --- 2. RIGHT COLUMN (Calendar) --- */}
                <div className="md:col-span-1">
                  <DayPicker 
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </div>
              </div>
              {/* --- END OF NEW LAYOUT --- */}
            </>
          } />


          {/* --- Route 2: The New Trainees Page --- */}
          <Route path="/trainees" element={
                <TraineePage
                  trainees={allTrainees}
                  onAddTrainee={handleAddNewTrainee}
                  onDeleteTrainee={handleDeleteTrainee}
                />
              } />
          </Routes>
      </main>
      <CreateSlotModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSlot={handleCreateSlot}
        selectedDate={selectedDate} // <-- ADD THIS PROP
      />

    </div>
  );
}

export default App;