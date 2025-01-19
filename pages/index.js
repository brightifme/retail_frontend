import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import StaffRegistration from "./staff";



export default function Home() {
  return (
    <>
      <StaffRegistration/>
    </>
  );
}
