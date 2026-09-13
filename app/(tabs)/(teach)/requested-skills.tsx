import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  getSkillRequests,
  updateSkillRequestStatus,
} from "@/services/skillRequestService";



export default function RequestedSkills() {


  const [requests, setRequests] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);



  const fetchRequests = async () => {

    try {

      const data = await getSkillRequests();

      setRequests(data);


    } catch (error) {


      console.log(
        "Failed to load requests:",
        error
      );


    } finally {


      setLoading(false);


    }

  };




  useEffect(() => {

    fetchRequests();

  }, []);





  const updateStatus = async (

    id: string,

    status: "matched" | "closed"

  ) => {


    try {


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


    }


  };





  if (loading) {


    return (

      <View style={styles.container}>

        <Text>
          Loading requests...
        </Text>


      </View>

    );


  }





  return (


    <View style={styles.container}>


      <Text style={styles.title}>

        Requested Skills

      </Text>





      <FlatList


        data={requests}


        keyExtractor={(item) =>
          item._id
        }



        renderItem={({ item }) => (



          <View style={styles.card}>


            <Text style={styles.skill}>

              {item.skillName}

            </Text>




            <Text>

              Requested By: {item.requesterId}

            </Text>




            <Text>

              Category: {item.category}

            </Text>




            <Text>

              Level: {item.level}

            </Text>




            <Text>

              Mode: {item.mode}

            </Text>




            <Text style={styles.goal}>

              Goal: {item.learningGoal}

            </Text>




            <Text>

              Status: {item.status}

            </Text>






            {
              item.status === "open" && (


                <View style={styles.buttons}>


                  <TouchableOpacity

                    style={styles.accept}

                    onPress={() =>

                      updateStatus(

                        item._id,

                        "matched"

                      )

                    }

                  >

                    <Text style={styles.btnText}>

                      Accept

                    </Text>


                  </TouchableOpacity>






                  <TouchableOpacity

                    style={styles.reject}

                    onPress={() =>

                      updateStatus(

                        item._id,

                        "closed"

                      )

                    }

                  >

                    <Text style={styles.btnText}>

                      Reject

                    </Text>


                  </TouchableOpacity>



                </View>


              )
            }





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



  title: {


    fontSize: 26,


    fontWeight: "bold",


    marginBottom: 20,


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


    marginBottom: 10,


  },



  goal: {


    marginVertical: 10,


  },



  buttons: {


    flexDirection: "row",


    gap: 10,


    marginTop: 15,


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


});