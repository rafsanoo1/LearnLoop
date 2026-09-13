import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import {
  getSkillById,
  updateSkill,
} from "@/services/skillService";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useEffect, useState } from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";



export default function EditOfferScreen() {


  const { id } =
    useLocalSearchParams<{ id:string }>();


  const [title,setTitle] =
    useState("");

  const [category,setCategory] =
    useState("");

  const [description,setDescription] =
    useState("");

  const [isActive,setIsActive] =
    useState(true);


  const [loading,setLoading] =
    useState(true);





  useEffect(()=>{


    const loadSkill = async()=>{

      try{


        const skill =
          await getSkillById(id!);


        setTitle(skill.title);

        setCategory(skill.category);

        setDescription(skill.description);

        setIsActive(skill.isActive);



      }
      catch(error){

        console.log(
          "Load skill error:",
          error
        );

      }
      finally{

        setLoading(false);

      }


    };



    if(id){

      loadSkill();

    }


  },[id]);









  const handleSave = async()=>{


    try{


      await updateSkill(

        id!,

        {

          title,

          category,

          description,

          isActive,

        }

      );



      const message =
      "Your skill offer was updated successfully.";



      if(Platform.OS==="web"){


        window.alert(message);


        router.replace(
          "/(tabs)/(teach)"
        );


        return;


      }




      Alert.alert(

        "Success",

        message,

        [

          {

            text:"OK",

            onPress:()=>{

              router.replace(
                "/(tabs)/(teach)"
              );

            },

          },

        ]

      );



    }
    catch(error){


      console.log(
        "Update error:",
        error
      );


      Alert.alert(

        "Error",

        "Failed to update skill offer."

      );


    }


  };









  if(loading){


    return(

      <View style={styles.center}>

        <Text>
          Loading...
        </Text>

      </View>

    );

  }









  return(

    <ScrollView

      style={styles.screen}

      contentContainerStyle={styles.content}

    >



      <Text style={styles.heading}>

        Edit Skill Offer

      </Text>






      <Text style={styles.label}>
        Skill Title
      </Text>


      <TextInput

        style={styles.input}

        value={title}

        onChangeText={setTitle}

      />






      <Text style={styles.label}>
        Category
      </Text>


      <TextInput

        style={styles.input}

        value={category}

        onChangeText={setCategory}

      />






      <Text style={styles.label}>
        Description
      </Text>


      <TextInput

        style={[
          styles.input,
          styles.textArea
        ]}

        value={description}

        onChangeText={setDescription}

        multiline

      />







      <Text style={styles.label}>
        Status
      </Text>




      <View style={styles.row}>


        <Pressable

          style={[
            styles.statusButton,
            isActive &&
            styles.activeButton
          ]}

          onPress={()=>setIsActive(true)}

        >

          <Text>
            Active
          </Text>

        </Pressable>





        <Pressable

          style={[
            styles.statusButton,
            !isActive &&
            styles.activeButton
          ]}

          onPress={()=>setIsActive(false)}

        >

          <Text>
            Paused
          </Text>

        </Pressable>



      </View>







      <Pressable

        style={styles.saveButton}

        onPress={handleSave}

      >

        <Text style={styles.saveText}>
          Save Changes
        </Text>


      </Pressable>





    </ScrollView>

  );

}









const styles = StyleSheet.create({


screen:{

flex:1,

backgroundColor:COLORS.background,

},



content:{

padding:SPACING.lg,

},




heading:{

fontSize:24,

fontWeight:"800",

marginBottom:20,

color:COLORS.textPrimary,

},




label:{

marginTop:15,

marginBottom:6,

fontWeight:"600",

color:COLORS.textPrimary,

},




input:{

backgroundColor:COLORS.surface,

borderWidth:1,

borderColor:COLORS.border,

borderRadius:RADIUS.md,

padding:12,

color:COLORS.textPrimary,

},




textArea:{

height:120,

textAlignVertical:"top",

},




row:{

flexDirection:"row",

gap:10,

marginTop:10,

},




statusButton:{

flex:1,

padding:14,

alignItems:"center",

borderWidth:1,

borderRadius:RADIUS.md,

borderColor:COLORS.border,

},




activeButton:{

backgroundColor:COLORS.primary,

},




saveButton:{

marginTop:30,

backgroundColor:COLORS.primary,

padding:15,

borderRadius:RADIUS.md,

alignItems:"center",

},




saveText:{

color:"white",

fontWeight:"bold",

},




center:{

flex:1,

justifyContent:"center",

alignItems:"center",

},


});