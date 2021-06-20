import * as actions from '../nodeActions'
import * as type from '../actionTypes'

describe('node action creator', () => {
    it('Edit Node Action Creator', () => {
        let id = 0
        let trackID = 0
        let latitude = 43.741667
        let longitude = -79.373333
    
        expect(actions.moveNode(id, latitude, longitude, trackID)).toEqual({
            type: type.MOVE_NODE,
            payload: {
                id: id,
                trackID: trackID,
                latitude: latitude,
                longitude: longitude
            }
        })
    })

    it('should get the right inverse action', () => {
        let state = [
            {id: 0, nodes:[
                {id: 0, longitude: 48, latitude: -70},
                {id: 1, longitude: 47, latitude: -71},
                {id: 2, longitude: 46, latitude: -72},
                {id: 3, longitude: 45, latitude: -73},
                {id: 4, longitude: 44, latitude: -74},    
            ]}
        ]
        expect(actions.getInverseNodeActions(state, {
            type: type.MOVE_NODE,
            payload: {
                id: 2,
                trackID: 0,
                longitude: 46.5,
                latitude: -71.5
            }
        })).toEqual({
            type: type.MOVE_NODE,
            payload: {
                id: 2,
                longitude: 46,
                latitude: -72,
                trackID: 0
            }
        })
    })
})
