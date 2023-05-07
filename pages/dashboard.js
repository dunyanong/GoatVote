import Head from "next/head";
import DeleteAccount from "../components/DeleteAcount";

const Dashboard = () => {
    return (
        <div className="md:px-5 md:py-30 w-full max-w-2xl mx-auto pt-20">
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
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
                    <p className="text-lg text-muted-foreground">Manage account and website settings.</p>
                </div>
            </div>
            <DeleteAccount />
        </div>
    );
}
 
export default Dashboard;