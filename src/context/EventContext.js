import React, { createContext, useReducer, useContext } from 'react';

// Define the initial state of your context
const initialState = { joined: false };

// Define a reducer function to handle actions
function reducer(state, action) {
    switch (action.type) {
        case 'join_event':
            return { ...state, joined: true };
        case 'leave_event':
            return { ...state, joined: false };
        default:
            return state;
    }
}

// Create the Context
const EventContext = createContext();

// Create a Context Provider component
export const EventProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <EventContext.Provider value={{ state, dispatch }}>
            {children}
        </EventContext.Provider>
    );
};

// Custom hook to use the event context
export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
