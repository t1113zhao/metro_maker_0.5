import * as utils from '../utils'

describe('util functions', () => {

    it('should get next id for array', () => {
        expect(utils.nextIDForArray([])).toEqual(0)
        expect(utils.nextIDForArray([{ id: 0 }, { id: 1 },])).toEqual(2)
    })

    let deleteArray = [
        { id: 0, deletedAt: null },
        { id: 1, deletedAt: 'yesterday' },
        { id: 2, deletedAt: null },
        { id: 3, deletedAt: 'yesterday' },
    ]

    it('should delete only a single item', () => {
        expect(utils.genericSingleDelete(deleteArray, 0, 'yesterday')).toEqual([
            { id: 0, deletedAt: 'yesterday' },
            { id: 1, deletedAt: 'yesterday' },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: 'yesterday' },
        ])

        expect(utils.genericSingleDelete(deleteArray, 1, 'yesterday')).toEqual(deleteArray)

        expect(utils.genericSingleDelete(deleteArray, 4, 'yesterday')).toEqual(deleteArray)

    })

    it('should restore only a single item', () => {
        expect(utils.genericSingleRestore(deleteArray, 1, 'yesterday')).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: 'yesterday' },
        ])

        expect(utils.genericSingleRestore(deleteArray, 0, 'yesterday')).toEqual(deleteArray)

        expect(utils.genericSingleRestore(deleteArray, 4, 'yesterday')).toEqual(deleteArray)
    })

    it('should delete multiple items', () => {
        expect(utils.genericMultiDelete(deleteArray, [0, 2], 'yesterday')).toEqual([
            { id: 0, deletedAt: 'yesterday' },
            { id: 1, deletedAt: 'yesterday' },
            { id: 2, deletedAt: 'yesterday' },
            { id: 3, deletedAt: 'yesterday' },
        ])

        expect(utils.genericMultiDelete(deleteArray, [4, 5], 'yesterday')).toEqual(deleteArray)
    })

    it('should restore multiple items', () => {
        expect(utils.genericMultiRestore(deleteArray, [1, 3])).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ])

        expect(utils.genericMultiRestore(deleteArray, [4, 5])).toEqual(deleteArray)
    })

    it('should filter deleted items', () => {
        expect(utils.filterDeleted(deleteArray, true)).toEqual(deleteArray)

        expect(utils.filterDeleted(deleteArray, false)).toEqual([
            { id: 0, deletedAt: null },
            { id: 2, deletedAt: null },
        ])
    })

    it('should filter items by ids', () => {
        expect(utils.filterByIds(deleteArray, [0, 1, 2, 3])).toEqual(deleteArray)

        expect(utils.filterByIds(deleteArray, [0, 2])).toEqual([
            { id: 0, deletedAt: null },
            { id: 2, deletedAt: null },
        ])

        expect(utils.filterByIds(deleteArray, [0, 2, 4])).toEqual([
            { id: 0, deletedAt: null },
            { id: 2, deletedAt: null },
        ])
    })

    it('should filter items by id', () => {
        expect(utils.filterById(deleteArray, 0)).toEqual([
            { id: 0, deletedAt: null },
        ])

        expect(utils.filterById(deleteArray, 1)).toEqual([
            { id: 1, deletedAt: 'yesterday' },
        ])

        expect(utils.filterById(deleteArray, 4)).toEqual([])

    })

    it('should filter out item by id', () => {
        expect(utils.filterOutById(deleteArray, 0)).toEqual([
            { id: 1, deletedAt: 'yesterday' },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: 'yesterday' },
        ])

        expect(utils.filterOutById(deleteArray, 4)).toEqual(deleteArray)
    })

    it('should filter out items by ids', () => {
        expect(utils.filterOutByIds(deleteArray, [0, 1])).toEqual([
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: 'yesterday' },
        ])

        expect(utils.filterOutByIds(deleteArray, [0, 1, 2, 3])).toEqual([])

        expect(utils.filterOutByIds(deleteArray, [4, 5])).toEqual(deleteArray)
    })

    it('should use idCompare to sort correctly', () => {
        let unsortedArray = [
            { id: 1, deletedAt: 'yesterday' },
            { id: 3, deletedAt: 'yesterday' },
            { id: 0, deletedAt: null },
            { id: 2, deletedAt: null },
        ]
        expect(unsortedArray.sort(utils.idCompareAsc)).toEqual(deleteArray)

        expect(unsortedArray.sort(utils.idCompareDsc)).toEqual([
            { id: 3, deletedAt: 'yesterday' },
            { id: 2, deletedAt: null },
            { id: 1, deletedAt: 'yesterday' },
            { id: 0, deletedAt: null },
        ])
    })
})
