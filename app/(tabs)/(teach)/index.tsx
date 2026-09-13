import OfferCard from "@/components/offer-card";
import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/constants/learnloop-theme";

import { getSkills } from "@/services/skillService";
import { SkillOffer } from "@/types/learnloop";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useCallback,
  useState,
} from "react";



export default function TeachScreen() {


  const [offers,setOffers] =
    useState<SkillOffer[]>([]);


  const [loading,setLoading] =
    useState(true);


  const [error,setError] =
    useState("");






  const loadOffers = async()=>{


    try{


      setLoading(true);

      setError("");



      const data = await getSkills();



      setOffers(

        data.filter(

          item=>item.mentorId==="u1"

        )

      );



    }

    catch(error){


      console.log(

        "Load offers error:",

        error

      );



      setError(

        "Failed to load your skill offers. Please try again."

      );


    }

    finally{


      setLoading(false);


    }


  };








  useFocusEffect(

    useCallback(()=>{


      loadOffers();



    },[])

  );









  const handleEdit = (

    offer:SkillOffer

  )=>{


    router.push({


      pathname:

      "/(tabs)/(teach)/edit/[id]",



      params:{


        id:offer.id,


      },


    });


  };









  if(loading){


    return(

      <View style={styles.center}>


        <Text style={styles.messageText}>

          Loading skill offers...

        </Text>


      </View>

    );


  }






  if(error){


    return(


      <View style={styles.center}>


        <Text style={styles.messageText}>

          {error}

        </Text>




        <Pressable

          style={styles.retryButton}

          onPress={loadOffers}

          accessibilityRole="button"

          accessibilityLabel="Retry loading skill offers"

          accessibilityHint="Attempts to load your skill offers again"

        >


          <Text style={styles.retryText}>

            Retry

          </Text>


        </Pressable>


      </View>


    );


  }









  return (


    <View style={styles.screen}>


      <FlatList


        data={offers}



        keyExtractor={

          item=>item.id

        }




        refreshing={loading}



        onRefresh={loadOffers}






        renderItem={({item})=>(


          <OfferCard

            offer={item}

            onEdit={handleEdit}

          />


        )}






        contentContainerStyle={styles.list}







        ListHeaderComponent={


          <View style={styles.header}>


            <Text style={styles.title}>

              My Skill Offers

            </Text>




            <Text style={styles.subtitle}>

              Manage the skills you offer to other students.

            </Text>









            <Pressable


              style={styles.createButton}



              onPress={()=>


                router.push(

                  "/(tabs)/(teach)/create"

                )


              }



              accessibilityRole="button"

              accessibilityLabel="Create new skill offer"

              accessibilityHint="Opens the screen to create a new skill offer"


            >



              <Ionicons

                name="add-circle-outline"

                size={20}

                color={COLORS.white}

              />




              <Text style={styles.createText}>

                Create New Offer

              </Text>


            </Pressable>









            <Pressable


              style={styles.secondaryButton}



              onPress={()=>


                router.push(

                  "/(tabs)/(teach)/incoming-requests"

                )


              }



              accessibilityRole="button"

              accessibilityLabel="View incoming requests"

              accessibilityHint="Opens requests from students interested in your skills"


            >



              <Ionicons

                name="mail-unread-outline"

                size={20}

                color={COLORS.primary}

              />




              <Text style={styles.secondaryText}>

                View Incoming Requests

              </Text>


            </Pressable>









            <Pressable


              style={styles.secondaryButton}



              onPress={()=>


                router.push(

                  "/(tabs)/(teach)/requested-skills"

                )


              }



              accessibilityRole="button"

              accessibilityLabel="View requested skills"

              accessibilityHint="Opens skills requested by other students"


            >



              <Ionicons

                name="book-outline"

                size={20}

                color={COLORS.primary}

              />




              <Text style={styles.secondaryText}>

                View Requested Skills

              </Text>


            </Pressable>









            <Text style={styles.count}>

              {offers.length} offers

            </Text>



          </View>


        }







        ListEmptyComponent={


          <View style={styles.empty}>


            <Text>

              No skill offers found.

            </Text>


          </View>


        }



      />


    </View>


  );


}









const styles = StyleSheet.create({



screen:{

flex:1,

backgroundColor:COLORS.background,

},



list:{

padding:SPACING.md,

paddingBottom:SPACING.xl,

},



header:{

marginBottom:SPACING.md,

},



title:{

fontSize:26,

fontWeight:"800",

color:COLORS.textPrimary,

},



subtitle:{

marginBottom:20,

color:COLORS.textSecondary,

},



createButton:{

backgroundColor:COLORS.primary,

padding:14,

borderRadius:RADIUS.md,

flexDirection:"row",

justifyContent:"center",

alignItems:"center",

gap:8,

marginBottom:12,

},



createText:{

color:COLORS.white,

fontWeight:"700",

},





secondaryButton:{

borderWidth:1,

borderColor:COLORS.primary,

backgroundColor:COLORS.primaryLight,

padding:13,

borderRadius:RADIUS.md,

flexDirection:"row",

justifyContent:"center",

alignItems:"center",

gap:8,

marginBottom:12,

},




secondaryText:{

color:COLORS.primary,

fontWeight:"700",

},




count:{

fontSize:17,

fontWeight:"700",

marginTop:10,

color:COLORS.textPrimary,

},




empty:{

alignItems:"center",

padding:40,

},




center:{

flex:1,

justifyContent:"center",

alignItems:"center",

padding:30,

},




messageText:{

fontSize:16,

color:COLORS.textSecondary,

textAlign:"center",

},




retryButton:{

marginTop:20,

backgroundColor:COLORS.primary,

paddingHorizontal:25,

paddingVertical:12,

borderRadius:RADIUS.md,

},




retryText:{

color:COLORS.white,

fontWeight:"700",

},



});