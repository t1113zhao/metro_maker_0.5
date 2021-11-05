import * as actions from '../nodeActions'
import * as type from '../actionTypes'

describe('node action creator', () => {
    it('Edit Node Action Creator', () => {
        let index = 0
        let trackID = 0
        let latitude = 43.741667
        let longitude = -79.373333

        expect(actions.moveNode(index, latitude, longitude, trackID)).toEqual({
            type: type.MOVE_NODE,
            payload: {
                index: index,
                trackID: trackID,
                latitude: latitude,
                longitude: longitude
            }
        })
    })

    it('should get the right inverse action', () => {
        let state = [
            {
                id: 0,
                nodes: [
                    [48.0, -70],
                    [47.5, -70.5],
                    [47.0, -71],
                    [46.5, -71.5]
                ]
            }
        ]
        expect(
            actions.getInverseNodeActions(state, {
                type: type.MOVE_NODE,
                payload: {
                    index: 2,
                    trackID: 0,
                    latitude: 46.5,
                    longitude: -71.5
                }
            })
        ).toEqual({
            type: type.MOVE_NODE,
            payload: {
                index: 2,
                latitude: 47.0,
                longitude: -71,
                trackID: 0
            }
        })
    })
})
