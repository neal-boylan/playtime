import { Track } from "./track.js";

export const trackMongoStore = {
  async getTracksByPlaylistId(id) {
    const tracks = await Track.find({ playlistid: id }).lean();
    return tracks;
  },

	async getAllTracks() {
    const tracks = await Track.find().lean();
    return tracks;
  },

	async addTrack(playlistId, track) {
    const newTrack = new Track(track);
    const trackObj = await newTrack.save();
    return this.getTrackById(trackObj._id);
  },

  async getTrackById(id) {
    if (id) {
      const track = await Track.findOne({ _id: id }).lean();
      return track;
    }
    return null;
  },

  /* async getPlaylistTracks(playlistId) {
    await db.read();
    let foundTracks = tracks.filter((track) => track.playlistid === playlistId);
    if (!foundTracks) {
      foundTracks = null;
    }
    return foundTracks;
  }, */

  async deleteTrack(id) {
    try {
      await Track.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

	async deleteTrackById(id) {
    try {
      await Track.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllTracks() {
    await Track.deleteMany({});
  },

  async updateTrack(track, updatedTrack) {
    const trackDoc = await Track.findOne({ _id: track.id });
    trackDoc.title = updatedTrack.title;
    trackDoc.artist = updatedTrack.artist;
    trackDoc.duration = updatedTrack.duration;
    await trackDoc.save();
  }
};