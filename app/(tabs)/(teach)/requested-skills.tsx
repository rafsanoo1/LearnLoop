import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import {
  getSkillRequests,
  updateSkillRequestStatus,
} from "@/services/skillRequestService";



interface SkillRequest {

  _id: string;

  requesterId: string;

  skillName: string;

  category: string;

  level:
    | "Beginner"
    | "Intermediate"
    | "Advanced";

  mode:
    | "Online"
    | "In Person"
    | "Either";

  learningGoal: string;

  status:
    | "open"
    | "matched"
    | "closed";

}



export default function RequestedSkills() {


  const [requests, setRequests] =
    useState<SkillRequest[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState("");


  const [updatingId, setUpdatingId] =
    useState<string | null>(null);




  const fetchRequests = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getSkillRequests();


      setRequests(data);


    } catch (error) {

      console.log(
        "Failed to load requests:",
        error
      );


      setError(
        "Failed to load requested skills."
      );


    } finally {

      setLoading(false);

    }

  };




  const refreshRequests = async () => {

    try {

      setRefreshing(true);

      setError("");


      const data =
        await getSkillRequests();


      setRequests(data);


    } catch (error) {

      console.log(
        "Refresh requests error:",
        error
      );


      setError(
        "Failed to refresh requested skills."
      );


    } finally {

      setRefreshing(false);

    }

  };




  React.useEffect(() => {

    fetchRequests();

  }, []);




  const updateStatus = async (

    id: string,

    status: "matched" | "closed"

  ) => {

    try {

      setUpdatingId(id);


      const updatedRequest =
        await updateSkillRequestStatus(
          id,
          status
        );


      setRequests((prev) =>

        prev.map((item) =>

          item._id === id

            ? updatedRequest

            : item

        )

      );


    } catch (error) {

      console.log(
        "Failed to update status:",
        error
      );


      setError(
        "Failed to update request status. Please try again."
      );


    } finally {

      setUpdatingId(null);

    }

  };




  if (loading) {

    return (

      <View style={styles.center}>

        <Text style={styles.messageText}>
          Loading requested skills...
        </Text>

      </View>

    );

  }




  if (error && requests.length === 0) {

    return (

      <View style={styles.center}>

        <Text style={styles.messageText}>
          {error}
        </Text>


        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchRequests}
        >

          <Text style={styles.retryText}>
            Retry
          </Text>

        </TouchableOpacity>

      </View>

    );

  }




  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        Requested Skills
      </Text>


      <Text style={styles.subtitle}>
        Review skill requests from students and respond to their learning needs.
      </Text>



      {error !== "" && (

        <Text style={styles.errorText}>
          {error}
        </Text>

      )}



      <FlatList

        data={requests}

        keyExtractor={(item) =>
          item._id
        }

        refreshControl={

          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshRequests}
          />

        }

        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyTitle}>
              No requested skills
            </Text>

            <Text style={styles.emptyText}>
              There are currently no skill requests.
            </Text>

          </View>

        }

        renderItem={({ item }) => (

          <View style={styles.card}>


            <Text style={styles.skill}>
              {item.skillName}
            </Text>


            <Text style={styles.detail}>
              Requested By: {item.requesterId}
            </Text>


            <Text style={styles.detail}>
              Category: {item.category}
            </Text>


            <Text style={styles.detail}>
              Level: {item.level}
            </Text>


            <Text style={styles.detail}>
              Mode: {item.mode}
            </Text>


            <Text style={styles.goal}>
              Goal: {item.learningGoal}
            </Text>


            <View style={styles.statusContainer}>

              <Text style={styles.statusLabel}>
                Status:
              </Text>

              <Text
                style={[
                  styles.status,
                  item.status === "matched" &&
                    styles.matchedStatus,
                  item.status === "closed" &&
                    styles.closedStatus,
                ]}
              >
                {item.status}
              </Text>

            </View>



            {item.status === "open" && (

              <View style={styles.buttons}>


                <TouchableOpacity

                  style={styles.accept}

                  disabled={
                    updatingId === item._id
                  }

                  onPress={() =>
                    updateStatus(
                      item._id,
                      "matched"
                    )
                  }

                >

                  <Text style={styles.btnText}>

                    {updatingId === item._id
                      ? "Updating..."
                      : "Accept"}

                  </Text>

                </TouchableOpacity>




                <TouchableOpacity

                  style={styles.reject}

                  disabled={
                    updatingId === item._id
                  }

                  onPress={() =>
                    updateStatus(
                      item._id,
                      "closed"
                    )
                  }

                >

                  <Text style={styles.btnText}>

                    {updatingId === item._id
                      ? "Updating..."
                      : "Reject"}

                  </Text>

                </TouchableOpacity>


              </View>

            )}

          </View>

        )}

      />

    </View>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: 20,

    backgroundColor: "#F8F8FF",

  },


  center: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    padding: 30,

    backgroundColor: "#F8F8FF",

  },


  messageText: {

    fontSize: 16,

    color: "#555",

    textAlign: "center",

  },


  title: {

    fontSize: 26,

    fontWeight: "bold",

    marginBottom: 6,

    color: "#1A1A2E",

  },


  subtitle: {

    fontSize: 14,

    color: "#6B7280",

    lineHeight: 20,

    marginBottom: 20,

  },


  errorText: {

    color: "#EF4444",

    fontSize: 13,

    marginBottom: 12,

  },


  card: {

    backgroundColor: "#fff",

    padding: 20,

    marginBottom: 15,

    borderRadius: 15,

    elevation: 3,

  },


  skill: {

    fontSize: 20,

    fontWeight: "bold",

    marginBottom: 12,

    color: "#1A1A2E",

  },


  detail: {

    fontSize: 14,

    color: "#555",

    marginBottom: 6,

  },


  goal: {

    fontSize: 14,

    color: "#555",

    marginVertical: 10,

    lineHeight: 20,

  },


  statusContainer: {

    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,

  },


  statusLabel: {

    fontSize: 14,

    fontWeight: "600",

    color: "#1A1A2E",

  },


  status: {

    marginLeft: 5,

    fontSize: 14,

    fontWeight: "700",

    color: "#F59E0B",

  },


  matchedStatus: {

    color: "#16A34A",

  },


  closedStatus: {

    color: "#EF4444",

  },


  buttons: {

    flexDirection: "row",

    gap: 10,

    marginTop: 18,

  },


  accept: {

    backgroundColor: "#5B5FEF",

    padding: 12,

    borderRadius: 10,

    flex: 1,

  },


  reject: {

    backgroundColor: "#EF4444",

    padding: 12,

    borderRadius: 10,

    flex: 1,

  },


  btnText: {

    color: "#fff",

    textAlign: "center",

    fontWeight: "bold",

  },


  retryButton: {

    marginTop: 20,

    backgroundColor: "#5B5FEF",

    paddingHorizontal: 25,

    paddingVertical: 12,

    borderRadius: 10,

  },


  retryText: {

    color: "#fff",

    fontWeight: "700",

  },


  emptyContainer: {

    alignItems: "center",

    padding: 40,

  },


  emptyTitle: {

    fontSize: 18,

    fontWeight: "700",

    color: "#1A1A2E",

  },


  emptyText: {

    marginTop: 6,

    color: "#6B7280",

    textAlign: "center",

  },

});