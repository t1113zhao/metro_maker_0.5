import * as actions from '../nodeActions'
import * as type from '../actionTypes'

it('Edit Node Action Creator', () => {
    let id = 0
    let trackID = 0
    let latitude = 43.741667
    let longitude = -79.373333

    expect(actions.editNode(id, latitude, longitude, trackID)).toEqual({
         type: type.MOVE_NODE,
         payload: {
             id: id,
             trackID: trackID,
             latitude: latitude,
             longitude: longitude
         }
    })
})
