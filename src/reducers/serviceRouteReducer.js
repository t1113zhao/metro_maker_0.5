import { genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {ADD_SERVICE, REMOVE_SERVICE, RESTORE_SERVICE,
    REMOVE_LINE, RESTORE_LINE,
    REMOVE_OPERATOR, RESTORE_OPERATOR,
    ADD_SERVICETRACK_TWOWAY, ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION, TWOWAY_TO_ONEWAY,
    REMOVE_SERVICE_TRACK, RESTORE_SERVICE_TRACK,
    REMOVE_STOP, RESTORE_STOP
} from '../actions/actionTypes'

//an array of serviceRoute objects
const initialState = [];

/* 
    A service route object stores three things
    1. The service runs along which tracks 
        (by extension passes through which stations)
    2. The service stops at which stations
    3. The order and grouping of service route

    1. This is done with a simple list 
    (rare for service to pass through and not stop and later pass through and stop at a station)
    2. This is done with a list of service Route objects and their ids
        service Route object consists of
            service-unique id
            service id
            track id
            from station id
            to station id
    3. This is done with a track block. A track block is a list of service tracks that start and end at a certain station. In most scenarios this is a service track pair that run between station A and station B along a certain track. Each track grouping should form a cycle, otherwise it is incomplete

    e.g.
    A<->B is represented as 

    A->B, A<-B

    If there were a section of track like this

    A <-- B1 <-- C
     \--> B2 --/

    That is represented within the track block as

    A <- B1, B1 <- C
    A -> B2, B2 -> C

    Also you can only add or delete from a service at the ends.
    
    4. A trackBlock stores the stations that it contains, the service tracks and the completeness/ validity of the block.

    If a block is not a perfect cycle then complete is false.
*/


export default function serviceRouteReducer(state = initialState, action){
    switch(action.type){
        case ADD_SERVICE:{
            return doAddServiceRoute(state)
        }
        case REMOVE_OPERATOR:
        case REMOVE_LINE: {
            return genericMultiDelete(
                state,
                action.payload.serviceIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_SERVICE:{
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_OPERATOR:
        case RESTORE_LINE:{
            return genericMultiRestore(
                state,
                action.payload.serviceIDs
            )
        }
        case RESTORE_SERVICE:{
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        case ADD_SERVICETRACK_TWOWAY: {
            return doAdd2WayServiceTrack(state,action);
        }
        default:
            return state;
    }

}

export function doAddServiceRoute(state){
    return[
        ... state,
        {
            serviceID: nextIDForArray(state),
            deletedAt: null,
            stopsByID:[],
            serviceTracks:[]        
        }
    ]
}

function doAdd2WayServiceTrack(state,action){
    return state.map( item => {
        if(item.serviceID != action.payload.serviceID){
            return item
        }

        let newStops = item.stopsByID.slice(0);
        for (stationID in action.payload.stationIDs){
            if(newStops.indexOf(stationID) === -1){
                newStops.push(stationID)
            }
        }

        let serviceTracks = item.serviceTracks.slice(0);

        let newBlock = [
                {
                    id: nextIDForArray(newServiceTracks),
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.endStation,
                    toStationID: action.payload.extStation
                },
                {
                    id: nextIDForArray(newServiceTracks),
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.extStation,
                    toStationID: action.payload.endStation
                }
            ];

        serviceTracks.splice(index,0,newBlock)
 
        return {
            ...item,
            stopsByID: newStops,
            serviceTracks: serviceTracks
        }
    })
}
