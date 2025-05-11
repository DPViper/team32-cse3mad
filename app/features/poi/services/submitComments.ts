import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";

type SubmitCommentsProps = {
  poiId: string;
  rating: number;
  comment: string;
  user: any;
};

export async function SubmitComments({ poiId,rating, comment, user}: SubmitCommentsProps) {

    if (!user || !poiId || comment.trim() === "") return;
    try {
      await addDoc(
        collection(db, `pois/${poiId}/comments`),
        {
        userId: user.uid,
        displayName: user.displayName || "Anonymous", // Add displayName with fallback
        comment,
        rating,
        createdAt: serverTimestamp(),
        }
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to post comment");
      throw error;
    }
 };
