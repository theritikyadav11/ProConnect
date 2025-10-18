import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../state/authAtom";
import {
  whatAreMyConnections,
  getAcceptedConnections,
  acceptConnectionRequest,
} from "../services/api";

export default function MyConnectionsPage() {
  const [auth] = useRecoilState(authAtom);
  const [tab, setTab] = useState("invitations"); // "invitations" or "connections"
  const [invitations, setInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await whatAreMyConnections(auth.token);
      setInvitations(res.data);
    } catch (err) {
      console.error(err);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await getAcceptedConnections(auth.token);
      setConnections(res.data);
    } catch (err) {
      console.error(err);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.token) return;
    if (tab === "invitations") fetchInvitations();
    else if (tab === "connections") fetchConnections();
  }, [auth.token, tab]);

  const handleAccept = (id) => {
    acceptConnectionRequest({
      token: auth.token,
      requestId: id,
      action_type: "accept",
    })
      .then(() => {
        alert("Connection accepted");
        fetchInvitations();
        fetchConnections();
      })
      .catch(console.error);
  };

  const handleIgnore = (id) => {
    acceptConnectionRequest({
      token: auth.token,
      requestId: id,
      action_type: "reject",
    })
      .then(() => {
        alert("Request ignored");
        fetchInvitations();
      })
      .catch(console.error);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setTab("invitations")}
            className={`px-4 py-2 font-semibold ${
              tab === "invitations"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Invitations ({invitations.length})
          </button>
          <button
            onClick={() => setTab("connections")}
            className={`px-4 py-2 font-semibold ${
              tab === "connections"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            My Connections ({connections.length})
          </button>
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}

        {tab === "invitations" && !loading && (
          <>
            {invitations.length === 0 ? (
              <div className="text-center text-gray-400 p-4">
                No invitations at the moment.
              </div>
            ) : (
              invitations.map((conn) => (
                <div
                  key={conn._id}
                  className="flex items-center py-3 border-b last:border-0"
                >
                  <img
                    src={conn.userId.profilePicture || "/default.jpg"}
                    alt={conn.userId.name}
                    className="w-12 h-12 rounded-full mr-3 border"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{conn.userId.name}</div>
                    <div className="text-gray-500 text-xs">
                      {conn.userId.currentPost || "--"}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Purpose:{" "}
                      <span className="font-medium">
                        {conn.purpose || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleIgnore(conn._id)}
                      className="border border-gray-400 px-4 py-1 rounded-full text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(conn._id)}
                      className="border border-blue-500 px-4 py-1 rounded-full text-blue-600 hover:bg-blue-50 text-sm"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {tab === "connections" && !loading && (
          <>
            {connections.length === 0 ? (
              <div className="text-center text-gray-400 p-4">
                No connections found.
              </div>
            ) : (
              connections.map((conn) => {
                // Show the *other* user info
                const otherUser =
                  conn.userId._id === auth.userId
                    ? conn.connectionId
                    : conn.userId;
                return (
                  <div
                    key={conn._id}
                    className="flex items-center py-3 border-b last:border-0"
                  >
                    <img
                      src={otherUser.profilePicture || "/default.jpg"}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full mr-3 border"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{otherUser.name}</div>
                      <div className="text-gray-500 text-xs">
                        {otherUser.currentPost || "--"}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Purpose:{" "}
                        <span className="font-medium">
                          {conn.purpose || "General"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
