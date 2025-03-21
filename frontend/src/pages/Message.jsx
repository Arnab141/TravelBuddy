// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../component/AllContext/AllContext.jsx';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// function Message() {
//   const { token, url, user } = useAppContext(); 
//   const [requests, setRequests] = useState([]);
//   const [editingRequest, setEditingRequest] = useState(null);
//   const navigate = useNavigate();

//   const getUserData = async () => {
//     try {
//       const response = await fetch(`${url}/api/trips/get-request-message`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setRequests(data.tripRequests);
//       } else {
//         toast.error(data.msg || 'Failed to load messages.');
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, [url, token]);


//   const handleResponse = async (requestId, status) => {
//     try {
//       const response = await fetch(`${url}/api/trips/respond-to-request`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ requestId, status }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success(`Request ${status}`);
//         setRequests((prev) => prev.map(req => req._id === requestId ? { ...req, status } : req));
//         setEditingRequest(null);
//       } else {
//         toast.error(data.msg || 'Failed to update request.');
//       }
//     } catch (error) {
//       console.error('Error updating request:', error);
//       toast.error('An error occurred.');
//     }
//   };


//   return (
//     <div className="p-5">
//       <h1 className="text-xl font-semibold mb-4">Trip Join Requests</h1>

//       {requests.length === 0 ? (
//         <p>No messages yet.</p>
//       ) : (
//         requests.map((request) => (
//           <div 
//             key={request._id} 
//             className="border p-3 rounded-lg shadow-md mb-3" 
//             // onClick={() => request.status === 'accepted' && navigate('/my-trips')}
//           >
//             {request.hostId && (request.hostId._id === user._id) ? (
//               <>
//                 <p><strong>{request.userId.name}</strong> wants to join your trip.</p>
//                 <p>Pickup: {request.pickupPoint.location} (₹{request.pickupPoint.price})</p>
//                 <p>Trip: {request.tripId.origin} → {request.tripId.destination} on {new Date(request.tripId.date).toLocaleDateString()}</p>

//                 {request.status === "pending" ? (
//                   <div className="mt-2">
//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded mr-2"
//                       onClick={() => handleResponse(request._id, 'accepted')}
//                     >
//                       Accept
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                       onClick={() => handleResponse(request._id, 'rejected')}
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <p>Status: {request.status}</p>
//                     {editingRequest === request._id ? (
//                       <div>
//                         <button
//                           className="bg-green-500 text-white px-3 py-1 rounded mr-2"
//                           onClick={() => handleResponse(request._id, 'accepted')}
//                         >
//                           Accept
//                         </button>
//                         <button
//                           className="bg-red-500 text-white px-3 py-1 rounded"
//                           onClick={() => handleResponse(request._id, 'rejected')}
//                         >
//                           Reject
//                         </button>
//                         <button
//                           className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
//                           onClick={() => setEditingRequest(null)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button className="text-blue-500 underline" onClick={() => setEditingRequest(request._id)}>
//                         Click here to edit status
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <p>You requested to join a trip hosted by <strong>{request.hostId?.name || 'Host'}</strong>.</p>
//                 <p>Pickup: {request.pickupPoint.location} (₹{request.pickupPoint.price})</p>
//                 <p>Trip: {request.tripId.origin} → {request.tripId.destination} on {new Date(request.tripId.date).toLocaleDateString()}</p>
//                 <p>Status: <span className={`font-bold ${request.status === 'accepted' ? 'text-green-500' : 'text-gray-500'}`}>{request.status}</span></p>
//               </>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default Message;







import React, { useEffect, useState } from 'react';
import { useAppContext } from '../component/AllContext/AllContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Message() {
  const { token, url, user } = useAppContext();
  const [requests, setRequests] = useState([]);
  const [prevRequests, setPrevRequests] = useState([]); // To track previous requests
  const [editingRequest, setEditingRequest] = useState(null);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const response = await fetch(`${url}/api/trips/get-request-message`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setRequests(data.tripRequests);
        console.log(data)
      } else {
        toast.error(data.msg || 'Failed to load messages.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    getUserData();
  }, [url, token]);

  const handleJoinTrip = async (tripId, userId, pickupPoint) => {
    try {
      console.log('Join trip function called');
       console.log(pickupPoint);
  
      const response = await fetch(`${url}/api/trips/join-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tripId, userId, pickupPoint }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to join trip');
      }
  
      console.log('Trip joined successfully:', data);
      toast.success('Trip joined successfully!');
      
  
    } catch (error) {
      console.error('Error joining trip:', error.message);
      toast.error(error.message || 'An error occurred while joining the trip.');
    }
  };
  

  const handleLeaveTrip = async (tripId,userId) => {
    console.log(tripId,userId);
    try {
      const response = await fetch(`${url}/api/trips/leave-trip`, {
        method: 'POST', // or 'DELETE' if your API supports it
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tripId, userId }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to leave trip: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Left trip successfully:', data);
    } catch (error) {
      console.error('Error leaving trip:', error.message);
    }
  };
  
  

  const handleResponse = async (requestId, status) => {
    try {
      const response = await fetch(`${url}/api/trips/respond-to-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, status }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Request ${status}`);
        setRequests((prev) => prev.map(req => req._id === requestId ? { ...req, status } : req));
        setEditingRequest(null);
        // winddose.onLoad();
      } else {
        toast.error(data.msg || 'Failed to update request.');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('An error occurred.');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-4">Trip Join Requests</h1>

      {requests.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            className="border p-3 rounded-lg shadow-md mb-3"
          >
            {request.hostId && (request.hostId._id === user._id) ? (
              <>
                <p><strong>{request.userId.name}</strong> wants to join your trip.</p>
                <p>Pickup: {request.pickupPoint.location} (₹{request.pickupPoint.price})</p>
                <p>Trip: {request.tripId.origin} → {request.tripId.destination} on {new Date(request.tripId.date).toLocaleDateString()}</p>

                {request.status === "pending" ? (
                  <div className="mt-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => {handleResponse(request._id, 'accepted'); handleJoinTrip(request.tripId._id,request.userId._id,request.pickupPoint)}}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {handleResponse(request._id, 'rejected'); handleLeaveTrip(request.tripId._id,request.userId._id)}}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>Status: {request.status}</p>
                    {editingRequest === request._id ? (
                      <div>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          onClick={() => {handleResponse(request._id, 'accepted'); handleJoinTrip(request.tripId._id,request.userId._id,request.pickupPoint)}}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() =>{ handleResponse(request._id, 'rejected'); handleLeaveTrip(request.tripId._id,request.userId._id)}}
                        >
                          Reject
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
                          onClick={() => setEditingRequest(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="text-blue-500 underline" onClick={() => setEditingRequest(request._id)}>
                        Click here to edit status
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <p>You requested to join a trip hosted by <strong>{request.hostId?.name || 'Host'}</strong>.</p>
                <p>Pickup: {request.pickupPoint.location} (₹{request.pickupPoint.price})</p>
                <p>Trip: {request.tripId.origin} → {request.tripId.destination} on {new Date(request.tripId.date).toLocaleDateString()}</p>
                <p>Status: <span className={`font-bold ${request.status === 'accepted' ? 'text-green-500' : 'text-gray-500'}`}>{request.status}</span></p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Message;
