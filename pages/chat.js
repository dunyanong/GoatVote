import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { auth, db } from "../utils/firebase";
import Head from "next/head";

const Guestbook = () => {
  //Form state
  const [message, setMessage] = useState({ comment: "" });
  const [messages, setMessages] = useState([]);
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  //Submit message
  const submitMessage = async (e) => {
    e.preventDefault();
    //Run checks for comment
    if (!message.comment) {
      console.log("No message written");
      return;
    }
    if (message.comment.length > 1000) {
      console.log("Message is too long 🤡");
      return;
    }

    if (message?.hasOwnProperty("id")) {
      const docRef = doc(db, "chats", message.id);
      const updatedMessage = { ...message, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedMessage);
      console.log("Sucess 1");
    } else {
      //Make a new post
      const collectionRef = collection(db, "chats");
      await addDoc(collectionRef, {
        ...message,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
        email: user.email,
      });
      setMessage({ comment: "" });
      console.log("Sucess 1");
    }
  };

  //Get messages from the database
  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });

    return unsubscribe;
  }, []);

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/Login");
    if (routeData.id) {
      setMessage({ comment: routeData.comment, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="md:p-5 w-full max-w-3xl mx-auto pt-20">
        <Head>
            <title>GoatVote</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
        <section className="md:px-10 lg:px-20 grid items-center gap-6 pt-20 pb-8 md:pt-10 md:pb-12 lg:pt-3 lg:pb-10">
            <h1 className="text-2xl md:text-5xl font-bold ">Chat section 💬</h1>
            <form style={{ opacity: 1 }} onSubmit={submitMessage}  className="relative max-w-[500px] text-sm flex items-center">
                <input
                    aria-label="Your message"
                    placeholder="Your message..."
                    name="entry"
                    type="text"
                    required
                    className="pl-4 pr-32 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full border-neutral-300 rounded-md bg-gray-100 text-neutral-900"
                    value={message.comment} 
                    onChange={(e) => setMessage({...message, comment: e.target.value})} 
                />
                <button
                    className="flex items-center justify-center absolute right-1 top-1 px-2 py-2 font-medium h-7 bg-neutral-200 text-neutral-900 rounded w-16"
                    type="submit"
                >
                    Submit
                </button>
            </form>
    
            {/* Display all messages */}
            <div className="mt-1">
            {messages.map((msg) => (
                <div key={msg.id} className="mb-4 flex items-center gap-1">
                <h4>{msg.username}:</h4>
                <p>{msg.comment}</p>
                </div>
            ))}
            </div>
        </section>
    </div>
  );     
}
 
export default Guestbook;