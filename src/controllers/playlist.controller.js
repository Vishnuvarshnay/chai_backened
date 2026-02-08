import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// 1. CREATE PLAYLIST
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
        videos: []
    })

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )
})

// 2. GET USER PLAYLISTS
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

    const playlists = await Playlist.find({ owner: userId })

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
    )
})

// 3. GET PLAYLIST BY ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
})

// 4. ADD VIDEO TO PLAYLIST
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist or Video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only owners can add videos to this playlist")
    }

    // $addToSet ensures the video is only added if it's not already there
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video added to playlist")
    )
})

// 5. REMOVE VIDEO FROM PLAYLIST
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist or Video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only owners can remove videos from this playlist")
    }

    // $pull removes the specific ID from the array
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist")
    )
})

// 6. DELETE PLAYLIST
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

// 7. UPDATE PLAYLIST
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID")
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: { name, description }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}