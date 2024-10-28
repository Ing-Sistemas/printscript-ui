import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
    }
]);

export const queryClient = new QueryClient()

const App = () => {
    const { isLoading,
            isAuthenticated,
            error,
            loginWithRedirect} = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (isAuthenticated) {
        return (
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        );
    } else {
        return <button onClick={() => loginWithRedirect()}>Log in</button>;
    }
}

// To enable Auth0 integration change the following line
//export default App;
// for this one:
export default withAuthenticationRequired(App);
