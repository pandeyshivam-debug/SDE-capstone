const files = []
let nextId = 1

export function createFile(ownerId, title='untitled', content='') {
    const file = {
        id: nextId++,
        ownerId, // from firebase
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    files.push(file)
    return file
}

export function getUserFiles(ownerId) {
    return files.filter((f) => f.ownerId === ownerId)
}

export function getFileById(id) {
    return files.filter((f) => f.id === parseInt(id))
}

export function updateFile(id, updates) {
    const file = getFileById(id)
    if(file) {
        Object.assign(file, updates, { updatedAt: new Date() })
    }
    return file
}

export function deleteFile(id) {
    const file = files.findIndex((f) => f.id === parseInt(id))
    if(index !== -1) {
        return files.splice(index, 1)[0]
    }
    return null
}
