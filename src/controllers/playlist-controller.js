import { db } from "../models/db.js";
import { TrackSpec } from "../models/joi-schemas.js";

export const playlistController = {
  index: {
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      const viewData = {
        title: "Playlist",
        playlist: playlist,
      };
      return h.view("playlist-view", viewData);
    },
  },

  addTrack: {
    validate: {
      payload: TrackSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const currentPlaylist = await db.playlistStore.getPlaylistById(request.params.id);
        return h.view("playlist-view", { title: "Add Track error", playlist:currentPlaylist, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
			const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      const newTrack = {
        title: request.payload.title,
      	artist: request.payload.artist,
      	duration: Number(request.payload.duration),
      };
      console.log("Track adding");
      await db.trackStore.addTrack(playlist._id, newTrack);
      return h.redirect(`/playlist/${playlist._id}`);
    },
  },

  deleteTrack: {
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.playlistid);
      await db.trackStore.deleteTrack(request.params.id);
      return h.redirect(`/playlist/${playlist._id}`);
    },
  },

};