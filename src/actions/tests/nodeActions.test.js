import * as actions from '../nodeActions'
import * as type from '../actionTypes'

it('Add Node Action Creator', () => {
    let trackID = 0
    let latitude = 43.741667
    let longitude = -79.373333

    expect(actions.addNode(latitude, longitude, trackID)).toEqual({
        type: type.ADD_NODE,
        payload: {
            trackID: trackID,
            latitude: latitude,
            longitude: longitude
        }
    })
})

it('Edit Node Action Creator', () => {
    let id = 0
    let trackID = 0
    let latitude = 43.741667
    let longitude = -79.373333

    expect(actions.editNode(id, latitude, longitude, trackID)).toEqual({
         type: type.EDIT_NODE,
         payload: {
             id: id,
             trackID: trackID,
             latitude: latitude,
             longitude: longitude
         }
    })
})

it('Remove Node Action Creator', () => {
    var MockDate = require('mockdate')
    MockDate.set(1434319925275);

    let id = 0
    let trackID = 0
    let deletedAt = new Date().toISOString()

    expect(actions.removeNode(id, trackID)).toEqual({
        type: type.REMOVE_NODE,
        payload: {
            id: id,
            trackID: trackID,
            deletedAt: deletedAt
        }
    })
})

it('Restore Node Action Creator', () => {
    let id = 0
    let trackID = 0

    expect(actions.restoreNode(id, trackID)).toEqual({
        type: type.RESTORE_NODE,
        payload: {
            id: id,
            trackID: trackID
        }
    })
})
