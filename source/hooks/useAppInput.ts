import {useInput, useApp} from 'ink';

type UseAppInputProps = {
  onPressTab: () => void;
};

/**
 * Custom hook for handling global app keyboard input
 */
export function useAppInput({onPressTab}: UseAppInputProps) {
  const {exit} = useApp();

  useInput((_input, key) => {
    if (key.escape) {
      exit();
    }
    if (key.tab) {
      onPressTab();
    }
  });
}
