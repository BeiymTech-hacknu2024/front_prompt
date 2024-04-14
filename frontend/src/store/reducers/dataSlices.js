import { createSlice } from "@reduxjs/toolkit";

const initState =
  localStorage.getItem("theme") !== null
    ? JSON.parse(localStorage.getItem("theme"))
    : false;

const themeSlice = createSlice({
  name: "darkTheme",
  initialState: initState,
  reducers: {
    toggleTheme: (state) => {
      // console.log("changing theme");
      const newState = !state;
      localStorage.setItem("theme", JSON.stringify(newState));
      const Root = document.getElementById("root");
      Root.style.backgroundColor = newState ? "EAEAEA" : "181818";

      return newState;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
// export default themeSlice.reducer;
export const {} = themeSlice;
