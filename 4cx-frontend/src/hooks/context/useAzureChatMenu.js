import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "store/features/azureMenuSlice";

export const useAzureMenuState = () => {
  const isMenuOpen = useSelector((state) => state.azureMenu.isMenuOpen);
  const dispatch = useDispatch();

  const toggleMenuState = () => {
    dispatch(toggleMenu()); // Ensure this action is being dispatched
  };

  return { isMenuOpen: isMenuOpen ? true : false, toggleMenuState };
};
