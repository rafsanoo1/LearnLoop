import { COLORS, RADIUS, SPACING } from "@/constants/learnloop-theme";
import { createSkill } from "@/services/skillService";
import { router } from "expo-router";
import { useState } from "react";
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


const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;


const DURATIONS = [
  "30",
  "60",
  "90",
];


const MODES = [
  "Online",
  "In Person",
  "Both",
] as const;


const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];



export default function CreateOfferScreen() {


  const [title,setTitle] = useState("");
  const [category,setCategory] = useState("");
  const [description,setDescription] = useState("");

  const [level,setLevel] =
    useState<(typeof LEVELS)[number]>("Beginner");

  const [duration,setDuration] =
    useState("60");

  const [mode,setMode] =
    useState<(typeof MODES)[number]>("Online");

  const [location,setLocation] = useState("");

  const [availableDays,setAvailableDays] =
    useState<string[]>([]);



  const toggleDay = (day:string)=>{

    setAvailableDays(prev =>

      prev.includes(day)
      ?
      prev.filter(item=>item!==day)
      :
      [...prev,day]

    );

  };




  const handleSubmit = async()=>{


    if(
      title.trim().length < 3 ||
      category.trim() === "" ||
      description.trim().length < 20 ||
      availableDays.length === 0
    ){

      Alert.alert(
        "Invalid Data",
        "Please fill all required fields correctly."
      );

      return;

    }



    try{


      await createSkill({

        mentorId:"u1",

        title:title.trim(),

        category:category.trim(),

        description:description.trim(),

        level,

        duration:Number(duration),

        mode,

        location,

        availableDays,

        rating:0,

        isActive:true,

      });



      const message =
      "Your skill offer was created successfully.";



      if(Platform.OS==="web"){

        window.alert(message);

        router.back();

      }

      else{

        Alert.alert(
          "Success",
          message,
          [
            {
              text:"OK",
              onPress:()=>router.back()
            }
          ]
        );

      }



    }
    catch(error){


      console.log(
        "CREATE SKILL ERROR:",
        error
      );


      Alert.alert(
        "Error",
        "Failed to create skill offer."
      );


    }


  };





return (

<ScrollView
style={styles.screen}
contentContainerStyle={styles.content}
>


<Text style={styles.heading}>
Create Skill Offer
</Text>



<TextInput
style={styles.input}
placeholder="Skill Title"
value={title}
onChangeText={setTitle}
/>



<TextInput
style={styles.input}
placeholder="Category"
value={category}
onChangeText={setCategory}
/>



<TextInput
style={[
styles.input,
styles.multiline
]}
placeholder="Description"
value={description}
onChangeText={setDescription}
multiline
/>



<Text style={styles.label}>
Level
</Text>


<View style={styles.row}>

{
LEVELS.map(item=>(

<Pressable
key={item}
style={[
styles.option,
level===item && styles.active
]}
onPress={()=>setLevel(item)}
>

<Text>
{item}
</Text>

</Pressable>

))
}

</View>




<Text style={styles.label}>
Duration
</Text>


<View style={styles.row}>

{
DURATIONS.map(item=>(

<Pressable
key={item}
style={[
styles.option,
duration===item && styles.active
]}
onPress={()=>setDuration(item)}
>

<Text>
{item} min
</Text>

</Pressable>

))
}

</View>




<Text style={styles.label}>
Mode
</Text>


<View style={styles.row}>

{
MODES.map(item=>(

<Pressable
key={item}
style={[
styles.option,
mode===item && styles.active
]}
onPress={()=>setMode(item)}
>

<Text>
{item}
</Text>

</Pressable>

))
}

</View>




<TextInput
style={styles.input}
placeholder="Location"
value={location}
onChangeText={setLocation}
/>




<Text style={styles.label}>
Available Days
</Text>


{
DAYS.map(day=>(

<Pressable
key={day}
onPress={()=>toggleDay(day)}
>

<Text>
{
availableDays.includes(day)
?
"✓ "
:
""
}
{day}

</Text>

</Pressable>

))
}




<Pressable
style={styles.submit}
onPress={handleSubmit}
>

<Text style={styles.submitText}>
Create Offer
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
},

label:{
marginTop:15,
marginBottom:10,
},

input:{
borderWidth:1,
borderColor:"#ccc",
padding:12,
borderRadius:RADIUS.md,
marginBottom:10,
},

multiline:{
height:100,
},

row:{
flexDirection:"row",
gap:10,
flexWrap:"wrap",
},

option:{
padding:10,
borderWidth:1,
borderRadius:10,
},

active:{
backgroundColor:COLORS.primary,
},

submit:{
marginTop:30,
backgroundColor:COLORS.primary,
padding:15,
borderRadius:RADIUS.md,
alignItems:"center",
},

submitText:{
color:"#fff",
fontWeight:"bold",
},


});