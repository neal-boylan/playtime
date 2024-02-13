import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../src/models/db.js";
import { singleTrack, testTracks, singlePlaylist, testPlaylists, testUsers} from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Track Model tests", () => {
  
  let newPlaylist = null;

  setup(async () => {
    db.init("mongo");
    await db.playlistStore.deleteAllPlaylists();
    await db.trackStore.deleteAllTracks();
    newPlaylist = await db.playlistStore.addPlaylist(singlePlaylist)
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTracks[i] = await db.trackStore.addTrack(newPlaylist._id, testTracks[i]);
    }
  });

 test("create a track", async () => {
    const newPlaylist2 = await db.playlistStore.addPlaylist(singlePlaylist);
    const newTrack = await db.trackStore.addTrack(newPlaylist2._id, singleTrack);
    assert.isNotNull(newTrack._id);
    assertSubset(singleTrack, newTrack);
  });

  test("get multiple tracks", async () => {
    const tracks = await db.trackStore.getTracksByPlaylistId(singlePlaylist._id);
    assert.equal(tracks.length, testTracks.length);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, returnedTracks.length);
    await db.trackStore.deleteAllTracks();
    returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(0, returnedTracks.length);
  });

  test("get a track - success", async () => {
    const newPlaylist2 = await db.playlistStore.addPlaylist(singlePlaylist);
    const track = await db.trackStore.addTrack(newPlaylist2._id, singleTrack);
    const returnedTrack = await db.trackStore.getTrackById(track._id);
    assertSubset(singleTrack, returnedTrack);
  });

  test("delete One Track - success", async () => {
    await db.trackStore.deleteTrackById(testTracks[0]._id);
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length - 1);
    const deletedTrack = await db.trackStore.getTrackById(testTracks[0]._id);
    assert.isNull(deletedTrack);
  });

  test("get a track - bad params", async () => {
    let nullTrack = await db.trackStore.getTrackById("");
    assert.isNull(nullTrack);
    nullTrack = await db.trackStore.getTrackById();
    assert.isNull(nullTrack);
  });

  test("delete One track - fail", async () => {
    await db.trackStore.deleteTrackById("bad-id");
    const allTracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, allTracks.length);
  });
});