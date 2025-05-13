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
  imageUrl: string;
};

export async function SubmitComments({ poiId,rating, comment, user, imageUrl}: SubmitCommentsProps) {

    if (!user || !poiId || comment.trim() === "") return;
    try {
      await addDoc(
        collection(db, `pois/${poiId}/comments`),
        {
        userId: user.uid,
        displayName: user.displayName || "Anonymous", // Add displayName with fallback
        comment,
        rating,
        imageUrl: imageUrl || null, 
        createdAt: serverTimestamp(),
        }
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to post comment");
      throw error;
    }
 };
