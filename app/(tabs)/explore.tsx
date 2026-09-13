import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import { getSkills } from "@/services/skillService";


interface Skill {

  id: string;
  title: string;
  category: string;
  description: string;
  level: string;
  duration: number;
  mode: string;
  location: string;
  rating: number;

}



export default function ExploreScreen() {


  const [skills,setSkills] =
    useState<Skill[]>([]);

  const [loading,setLoading] =
    useState(true);



  const loadSkills = async()=>{


    try{


      const data = await getSkills();

      setSkills(data as Skill[]);


    }
    catch(error){

      console.log(
        "LOAD SKILLS ERROR:",
        error
      );

    }
    finally{

      setLoading(false);

    }


  };




  useEffect(()=>{

    loadSkills();

  },[]);





  if(loading){

    return(

      <View style={styles.center}>

        <ActivityIndicator size="large"/>

        <Text>
          Loading skills...
        </Text>

      </View>

    );

  }





  return(

    <View style={styles.container}>


      <Text style={styles.heading}>
        Discover Skills
      </Text>



      <FlatList

        data={skills}

        keyExtractor={(item)=>item.id}


        renderItem={({item})=>(


          <View style={styles.card}>


            <Text style={styles.title}>
              {item.title}
            </Text>



            <Text>
              Category: {item.category}
            </Text>


            <Text>
              Level: {item.level}
            </Text>



            <Text>
              Duration: {item.duration} minutes
            </Text>



            <Text>
              Mode: {item.mode}
            </Text>



            {
              item.location !== "" &&
              <Text>
                Location: {item.location}
              </Text>
            }



            <Text style={styles.description}>
              {item.description}
            </Text>



            <Text>
              ⭐ Rating: {item.rating}
            </Text>


          </View>


        )}


        ListEmptyComponent={

          <Text>
            No skills available yet.
          </Text>

        }


      />


    </View>


  );


}





const styles = StyleSheet.create({


  container:{

    flex:1,

    padding:20,

    backgroundColor:"#F8F8FF",

  },


  center:{

    flex:1,

    justifyContent:"center",

    alignItems:"center",

  },


  heading:{

    fontSize:26,

    fontWeight:"bold",

    marginBottom:20,

  },


  card:{

    backgroundColor:"#fff",

    padding:20,

    borderRadius:15,

    marginBottom:15,

    elevation:3,

  },


  title:{

    fontSize:20,

    fontWeight:"bold",

    marginBottom:10,

  },


  description:{

    marginVertical:10,

  },


});