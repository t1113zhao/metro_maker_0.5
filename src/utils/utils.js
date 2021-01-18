export function nextIDForArray(array){
    const maxID = array.reduce((maxID, element) => Math.max(element.id, maxID),-1)
    return maxID + 1
};
