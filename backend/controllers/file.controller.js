import {
    createFile,
    getUserFiles,
    getFileById,
    updateFile,
    deleteFile
} from '../models/file.model.js'

export function create(req, res) {
    const { title, content } = req.body
    const ownerId = req.user.uid
    
    const file = (createFile, ownerId, title, content)
    res.status(201).json(file)
}

export function getAll(req, res) {
    const ownerId = req.user.uid
    const files = getUserFiles(ownerId)
    res.json(files)
}

export function getOne(req, res) {
    const file = getFileById(req.params.id)
    if (!file || file.ownerId !== req.user.uid) {
        return res.status(404).json({ error: "File not found" })
    }
    res.json(file)
}

export function update(req, res) {
    const file = getFileById(req.params.id)
    if (!file || file.ownerId !== req.user.uid) {
        return res.status(404).json({ error: "File not found" })
    }
    const updatedFile = updateFile(file.id, req.body)
    res.json(updatedFile)
}

export function remove(req, res) {
    const file = getFileById(req.params.id)
    if (!file || file.ownerId !== req.user.uid) {
        return res.status(404).json({ error: "File not found" })
    }
    deleteFile(file.id)
    res.status(204).send()
}