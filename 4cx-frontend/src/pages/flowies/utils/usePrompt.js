// import { useCallback, useContext, useEffect } from 'react'
// import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

// // https://stackoverflow.com/questions/71572678/react-router-v-6-useprompt-typescript

// export function useBlocker(blocker, when = true) {
//     const { navigator } = useContext(NavigationContext)

//     useEffect(() => {
//         if (!when) return

//         const unblock = navigator.block((tx) => {
//             const autoUnblockingTx = {
//                 ...tx,
//                 retry() {
//                     unblock()
//                     tx.retry()
//                 }
//             }

//             blocker(autoUnblockingTx)
//         })

//         return unblock
//     }, [navigator, blocker, when])
// }

// export function usePrompt(message, when = true) {
//     const blocker = useCallback(
//         (tx) => {
//             if (window.confirm(message)) tx.retry()
//         },
//         [message]
//     )

//     useBlocker(blocker, when)
// }

import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom hook to block navigation
export function useBlocker(blocker, when = true) {
  let navigate = useNavigate();
  const [shouldBlock, setShouldBlock] = useState(when);

  // When the blocking condition changes (e.g., when is toggled), we update the blocking state
  useEffect(() => {
    if (!shouldBlock) return;

    // Temporarily replace navigate with a function that shows a confirmation dialog
    const originalNavigate = navigate;
    const customNavigate = (to, options) => {
      if (window.confirm("You have unsaved changes. Do you really want to leave?")) {
        originalNavigate(to, options); // Proceed with navigation
      }
    };
    navigate = customNavigate;

    return () => {
      navigate = originalNavigate; // Restore the original navigate function when the effect cleans up
    };
  }, [navigate, shouldBlock, blocker]);

  return {
    shouldBlock,
    setShouldBlock, // This can be used to toggle when blocking is enabled
  };
}

export function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry(); // Confirm the action
    },
    [message]
  );

  useBlocker(blocker, when);  // Use the blocker in your component
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = message;
  //     return message;
  //   };
  //   // Select all <a> tags
  //   const links = document.querySelectorAll("a");
  //   console.log(links ,"linkssss")
  //   // Loop through all the links and add a click listener to each
  //   links.forEach((link) => {
  //     link.addEventListener("click", function (event) {
  //       event.preventDefault(); // Prevent default link behavior
  //       console.log("Link clicked: " + link.href); // Log the href of the clicked link
  //     });
  //   });

  //   if (when) {
  //     window.confirm(message);
  //     window.addEventListener("beforeunload", handleBeforeUnload);
  //   }

  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [when, message]);
}
