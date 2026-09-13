import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";

import {
  getSkillRequests,
  updateSkillRequestStatus,
} from "@/services/skillRequestService";

import { Ionicons } from "@expo/vector-icons";

import {
  useEffect,
  useState,
} from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";



interface SkillRequest {

  _id:string;

  requesterId:string;

  skillName:string;

  category:string;

  level:
  | "Beginner"
  | "Intermediate"
  | "Advanced";

  mode:
  | "Online"
  | "In Person"
  | "Either";

  learningGoal:string;

  status:
  | "open"
  | "matched"
  | "closed";

}





export default function IncomingRequestsScreen(){



const [requests,setRequests] =
useState<SkillRequest[]>([]);



const [loading,setLoading] =
useState(true);



const [error,setError] =
useState("");






const loadRequests = async()=>{


try{


setLoading(true);

setError("");



const data =
await getSkillRequests();



setRequests(data);



}
catch(err){


console.log(
"Load request error:",
err
);


setError(
"Failed to load incoming requests."
);


}
finally{


setLoading(false);


}



};







useEffect(()=>{

loadRequests();

},[]);








const changeStatus = async(

id:string,

status:"matched"|"closed"

)=>{


try{


await updateSkillRequestStatus(

id,

status

);



await loadRequests();



}

catch(error){


console.log(
"Update request error:",
error
);


}



};









if(loading){


return(

<View style={styles.center}>

<Text>
Loading requests...
</Text>

</View>

);


}









if(error){


return(

<View style={styles.center}>

<Text>
{error}
</Text>


<Pressable

style={styles.retryButton}

onPress={loadRequests}

>

<Text style={styles.retryText}>
Retry
</Text>

</Pressable>


</View>

);


}









return(


<ScrollView

style={styles.screen}

contentContainerStyle={styles.content}

refreshControl={undefined}

>



<Text style={styles.heading}>
Incoming Requests
</Text>




<Text style={styles.subtitle}>
Review students who want to learn your skills.
</Text>







{
requests.length===0 ? (


<View style={styles.emptyContainer}>


<Ionicons

name="mail-open-outline"

size={45}

color={COLORS.textLight}

/>


<Text style={styles.emptyTitle}>
No requests yet
</Text>


<Text style={styles.emptyText}>
New requests will appear here.
</Text>



</View>


)

:

requests.map((request)=>(


<View

key={request._id}

style={styles.card}

>



<View style={styles.cardHeader}>


<View style={styles.avatar}>


<Text style={styles.avatarText}>

{
String(request.requesterId)
.charAt(0)
.toUpperCase()
}

</Text>


</View>





<View style={styles.studentInfo}>


<Text style={styles.studentName}>

Student {request.requesterId}

</Text>


<Text style={styles.skillTitle}>

{request.skillName}

</Text>


</View>







<View

style={[

styles.statusBadge,


request.status==="matched"

&& styles.acceptedBadge,


request.status==="closed"

&& styles.closedBadge,


]}

>


<Text

style={[

styles.statusText,


request.status==="matched"

&& styles.acceptedText,


request.status==="closed"

&& styles.closedText,


]}

>

{request.status}

</Text>


</View>




</View>








<View style={styles.detailItem}>


<Ionicons

name="book-outline"

size={17}

color={COLORS.primary}

/>


<Text style={styles.detailText}>

{request.category}

</Text>


</View>







<View style={styles.detailItem}>


<Ionicons

name="school-outline"

size={17}

color={COLORS.primary}

/>


<Text style={styles.detailText}>

{request.level}

</Text>


</View>







<View style={styles.detailItem}>


<Ionicons

name={
request.mode==="Online"
?
"videocam-outline"
:
"location-outline"
}

size={17}

color={COLORS.primary}

/>


<Text style={styles.detailText}>

{request.mode}

</Text>


</View>








<Text style={styles.objectiveLabel}>
Learning Goal
</Text>


<Text style={styles.objective}>
{request.learningGoal}
</Text>







{
request.status==="open" &&


<View style={styles.actionRow}>


<Pressable

style={styles.declineButton}

onPress={()=>changeStatus(

request._id,

"closed"

)}

>


<Text style={styles.declineText}>
Decline
</Text>


</Pressable>






<Pressable

style={styles.acceptButton}

onPress={()=>changeStatus(

request._id,

"matched"

)}

>


<Text style={styles.acceptText}>
Accept
</Text>


</Pressable>



</View>


}




</View>


))


}



</ScrollView>


);


}









const styles=StyleSheet.create({


screen:{
flex:1,
backgroundColor:COLORS.background,
},


content:{
padding:SPACING.md,
},


heading:{
fontSize:25,
fontWeight:"800",
color:COLORS.textPrimary,
},


subtitle:{
marginTop:5,
marginBottom:20,
color:COLORS.textSecondary,
},


card:{
backgroundColor:COLORS.surface,
borderWidth:1,
borderColor:COLORS.border,
borderRadius:RADIUS.lg,
padding:SPACING.md,
marginBottom:SPACING.md,
},


cardHeader:{
flexDirection:"row",
alignItems:"center",
},


avatar:{
width:42,
height:42,
borderRadius:30,
backgroundColor:COLORS.primaryLight,
alignItems:"center",
justifyContent:"center",
},


avatarText:{
color:COLORS.primary,
fontWeight:"800",
},


studentInfo:{
flex:1,
marginLeft:10,
},


studentName:{
fontWeight:"700",
color:COLORS.textPrimary,
},


skillTitle:{
color:COLORS.textSecondary,
},


statusBadge:{
paddingHorizontal:10,
paddingVertical:5,
borderRadius:20,
backgroundColor:"#FEF3C7",
},


acceptedBadge:{
backgroundColor:"#DCFCE7",
},


closedBadge:{
backgroundColor:"#FEE2E2",
},


statusText:{
fontSize:11,
fontWeight:"700",
color:"#92400E",
},


acceptedText:{
color:COLORS.success,
},


closedText:{
color:COLORS.danger,
},


detailItem:{
flexDirection:"row",
alignItems:"center",
gap:8,
marginTop:12,
},


detailText:{
color:COLORS.textSecondary,
},


objectiveLabel:{
marginTop:15,
fontWeight:"700",
color:COLORS.textPrimary,
},


objective:{
marginTop:5,
color:COLORS.textSecondary,
},


actionRow:{
flexDirection:"row",
gap:10,
marginTop:20,
},


declineButton:{
flex:1,
padding:12,
borderWidth:1,
borderColor:COLORS.danger,
alignItems:"center",
borderRadius:RADIUS.md,
},


declineText:{
color:COLORS.danger,
fontWeight:"700",
},


acceptButton:{
flex:1,
padding:12,
backgroundColor:COLORS.primary,
alignItems:"center",
borderRadius:RADIUS.md,
},


acceptText:{
color:COLORS.white,
fontWeight:"700",
},


emptyContainer:{
alignItems:"center",
padding:40,
},


emptyTitle:{
fontSize:17,
fontWeight:"700",
marginTop:15,
},


emptyText:{
color:COLORS.textSecondary,
},


center:{
flex:1,
justifyContent:"center",
alignItems:"center",
},


retryButton:{
marginTop:20,
backgroundColor:COLORS.primary,
padding:12,
borderRadius:RADIUS.md,
},


retryText:{
color:COLORS.white,
fontWeight:"700",
},


});