//Agency Management Action Types
export const ADD_AGENCY = 'ADD_AGENCY'
export const UNDO_ADD_AGENCY = 'UNDO_ADD_AGENCY'
export const EDIT_AGENCY = 'EDIT_AGENCY'
export const REMOVE_AGENCY = 'REMOVE_AGENCY'
export const RESTORE_AGENCY = 'RESTORE_AGENCY'

//Line Management Action Types
export const ADD_LINE = 'ADD_LINE'
export const UNDO_ADD_LINE = 'UNDO_ADD_LINE'
export const EDIT_LINE = 'EDIT_LINE'
export const REMOVE_LINE = 'REMOVE_LINE'
export const RESTORE_LINE = 'RESTORE_LINE'

//Service Management Action Types
export const ADD_SERVICE = 'ADD_SERVICE'
export const UNDO_ADD_SERVICE = 'UNDO_ADD_SERVICE'
export const EDIT_SERVICE = 'EDIT_SERVICE'
export const REMOVE_SERVICE = 'REMOVE_SERVICE'
export const RESTORE_SERVICE = 'RESTORE_SERVICE'

//ServiceRoute Action Types
// Adding Tracks
export const ADD_SERVICETRACK_TWOWAY = 'ADD_SERVICETRACK_TWOWAY'
export const ADD_SERVICETRACK_ONEWAY = 'ADD_SERVICETRACK_ONEWAY'

//Changing a Track Block
export const SWITCH_ONEWAY_DIRECTION = 'SWITCH_ONEWAY_DIRECTION'
export const ONEWAY_TO_TWOWAY = 'ONEWAY_TO_TWOWAY'
export const TWOWAY_TO_ONEWAY = 'TWOWAY_TO_ONEWAY'
export const REMOVE_SERVICE_ALONG_TRACK = 'REMOVE_SERVICE_ALONG_TRACK'

// Clearing the entire Service Route Object
export const CLEAR_SERVICE_ROUTE = 'CLEAR_SERVICE_ROUTE'
export const UNDO_CLEAR_SERVICE_ROUTE = 'UNDO_CLEAR_SERVICE_ROUTE'

// Editing Stops
export const REMOVE_STOP = 'REMOVE_STOP'
export const RESTORE_STOP = 'RESTORE_STOP'

//Station Action Types
export const ADD_STATION = 'ADD_STATION'
export const UNDO_ADD_STATION = 'UNDO_ADD_STATION'
export const EDIT_STATION = 'EDIT_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const RESTORE_STATION = 'RESTORE_STATION'
export const MOVE_STATION = 'MOVE_STATION'

//Transfer Action Types
export const ADD_TRANSFER = 'ADD_TRANSFER'
export const UNDO_ADD_TRANSFER = 'UNDO_ADD_TRANSFER'
export const EDIT_TRANSFER = 'EDIT_TRANSFER'
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER'
export const RESTORE_TRANSFER = 'RESTORE_TRANSFER'

//TrackRoute Action Types
export const ADD_NEW_TRACKROUTE_NODES = 'ADD_NEW_TRACKROUTE_NODES'
export const EDIT_TRACKROUTE_NODES = 'EDIT_TRACKROUTE_NODES'
export const CLEAR_TRACKROUTE_NODES = 'CLEAR_TRACKROUTE_NODES'

//Node Action Types
export const MOVE_NODE = 'MOVE_NODE'

//Track Action Types
export const ADD_TRACK = 'ADD_TRACK'
export const UNDO_ADD_TRACK = 'UNDO_ADD_TRACK'
export const REMOVE_TRACK = 'REMOVE_TRACK'
export const RESTORE_TRACK = 'RESTORE_TRACK'

//UNDO REDO
export const GLOBAL_UNDO = 'GLOBAL_UNDO'
export const GLOBAL_REDO = 'GLOBAL_REDO'
