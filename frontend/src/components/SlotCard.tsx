// import { useState } from 'react';
// import { TimeSlot, Trainee } from '../types/types.ts';
// import { Clock, User, X, Calendar, UserPlus } from 'lucide-react';
// import { format } from 'date-fns';
// import { parseISO } from 'date-fns';

// interface SlotCardProps {
//   slot: TimeSlot;
//   allTrainees: Trainee[]; // <-- We now need the master trainee list
//   onDeleteSlot: (slotId: string) => void;
//   onAddTrainee: (slotId: string, traineeId: string) => void; // <-- Prop definition updated
//   onRemoveTrainee: (slotId: string, traineeId: string) => void;
// }

// export default function SlotCard({
//   slot,
//   allTrainees,
//   onDeleteSlot,
//   onAddTrainee,
//   onRemoveTrainee
// }: SlotCardProps) {
  
//   // NEW: Local state for the dropdown
//   const [isAdding, setIsAdding] = useState(false);
//   const [selectedTraineeId, setSelectedTraineeId] = useState('');
  
//   const availableSpots = slot.maxTrainees - slot.trainees.length;
//   const isFull = availableSpots === 0;

//   // NEW: Logic for the dropdown
//   // Filters the master list to find trainees NOT already in this slot
//   const availableTrainees = allTrainees.filter(masterTrainee =>
//     !slot.trainees.some(slotTrainee => slotTrainee.id === masterTrainee.id)
//   );

//   const handleShowAdd = () => {
//     setIsAdding(true);
//     // Set default dropdown value to the first available trainee
//     if (availableTrainees.length > 0) {
//       setSelectedTraineeId(availableTrainees[0].id);
//     }
//   };

//   const handleConfirmAdd = () => {
//     if (!selectedTraineeId) return;
//     onAddTrainee(slot.id, selectedTraineeId);
//     setIsAdding(false);
//     setSelectedTraineeId('');
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//       <div className="p-4">
//             {/* Header: Time, Day, and Delete Button */}
//             <div className="flex justify-between items-center mb-3">
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-blue-600" />
//                 <span className="font-bold text-lg text-gray-800">
//                   {slot.startTime} - {slot.endTime}
//                 </span>
//                 <span className="text-gray-500">|</span>
//                 <Calendar className="w-5 h-5 text-gray-500" />
//                 <span className="text-md font-medium text-gray-600">
//                   {format(parseISO(slot.date), 'EEEE, MMMM do, yyyy')} {/* <-- FIXED DATE DISPLAY */}
//                 </span>
//               </div>
//               {/* ... (rest of the header) ... */}
//           <button
//             onClick={() => onDeleteSlot(slot.id)}
//             className="text-gray-400 hover:text-red-500 transition-colors"
//             title="Delete slot"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Trainee List */}
//         <div className="mb-4">
//           <h4 className="text-sm font-semibold text-gray-700 mb-2">
//             Trainees ({slot.trainees.length} / {slot.maxTrainees})
//           </h4>
//           <div className="space-y-2">
//             {slot.trainees.length > 0 ? (
//               slot.trainees.map((trainee) => (
//                 <div key={trainee.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
//                   <div className="flex items-center space-x-2">
//                     <User className="w-4 h-4 text-gray-600" />
//                     <span className="text-sm text-gray-800">{trainee.name}</span>
//                   </div>
//                   {/* NEW: Remove Trainee Button */}
//                   <button
//                     onClick={() => onRemoveTrainee(slot.id, trainee.id)}
//                     className="text-gray-400 hover:text-red-500 transition-colors"
//                     title="Remove trainee"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 italic">No trainees assigned.</p>
//             )}
//           </div>
//         </div>

//         {/* NEW: Conditional Add Trainee UI */}
//         {isAdding ? (
//           <div className="space-y-2">
//             <select
//               value={selectedTraineeId}
//               onChange={(e) => setSelectedTraineeId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//             >
//               {availableTrainees.map(t => (
//                 <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>
//               ))}
//             </select>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleConfirmAdd}
//                 className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={() => setIsAdding(false)}
//                 className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={handleShowAdd}
//             disabled={isFull || availableTrainees.length === 0}
//             className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
//           >
//             <UserPlus className="w-4 h-4 mr-2" />
//             {isFull ? 'Slot is Full' : (availableTrainees.length === 0 ? 'All Trainees Assigned' : 'Add Trainee')}
//           </button>
//         )}
        
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { TimeSlot, Trainee } from '../types/types.ts';
import { Clock, User, X, Calendar, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';

interface SlotCardProps {
  slot: TimeSlot;
  allTrainees: Trainee[]; // <-- We now need the master trainee list
  onDeleteSlot: (slotId: string) => void;
  onAddTrainee: (slotId: string, traineeId: string) => void; // <-- Prop definition updated
  onRemoveTrainee: (slotId: string, traineeId: string) => void;
}

export default function SlotCard({
  slot,
  allTrainees,
  onDeleteSlot,
  onAddTrainee,
  onRemoveTrainee
}: SlotCardProps) {
  
  // NEW: Local state for the dropdown
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState('');
  
  const availableSpots = slot.maxTrainees - slot.trainees.length;
  const isFull = availableSpots === 0;

  // NEW: Logic for the dropdown
  // Filters the master list to find trainees NOT already in this slot
  const availableTrainees = allTrainees.filter(masterTrainee =>
    !slot.trainees.some(slotTrainee => slotTrainee.id === masterTrainee.id)
  );

  const handleShowAdd = () => {
    setIsAdding(true);
    // Set default dropdown value to the first available trainee
    if (availableTrainees.length > 0) {
      setSelectedTraineeId(availableTrainees[0].id);
    }
  };

  const handleConfirmAdd = () => {
    if (!selectedTraineeId) return;
    onAddTrainee(slot.id, selectedTraineeId);
    setIsAdding(false);
    setSelectedTraineeId('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4">
            {/* Header: Time, Day, and Delete Button */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-lg text-gray-800">
                  {slot.startTime} - {slot.endTime}
                </span>
                <span className="text-gray-500">|</span>
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-md font-medium text-gray-600">
                  {format(parseISO(slot.date), 'EEEE, MMMM do, yyyy')} {/* <-- FIXED DATE DISPLAY */}
                </span>
              </div>
              {/* ... (rest of the header) ... */}
          <button
            onClick={() => onDeleteSlot(slot.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete slot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trainee List */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Trainees ({slot.trainees.length} / {slot.maxTrainees})
          </h4>
          <div className="space-y-2">
            {slot.trainees.length > 0 ? (
              slot.trainees.map((trainee) => (
                <div key={trainee.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">{trainee.name}</span>
                  </div>
                  {/* NEW: Remove Trainee Button */}
                  <button
                    onClick={() => onRemoveTrainee(slot.id, trainee.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove trainee"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No trainees assigned.</p>
            )}
          </div>
        </div>

        {/* NEW: Conditional Add Trainee UI */}
        {isAdding ? (
          <div className="space-y-2">
            <select
              value={selectedTraineeId}
              onChange={(e) => setSelectedTraineeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {availableTrainees.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>
              ))}
            </select>
            {/* --- RESPONSIVE UPDATE: Stack buttons vertically on mobile --- */}
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                onClick={handleConfirmAdd}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleShowAdd}
            disabled={isFull || availableTrainees.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isFull ? 'Slot is Full' : (availableTrainees.length === 0 ? 'All Trainees Assigned' : 'Add Trainee')}
          </button>
        )}
        
      </div>
    </div>
  );
}