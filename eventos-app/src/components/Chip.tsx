import { Pressable, Text } from 'react-native';
import { colors, radius, spacing, fonts } from '../theme/tokens';
export function Chip({ label, selected, onPress }:{label:string; selected?:boolean; onPress?:()=>void}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.blueSoft,
        borderRadius: radius.sm,
        paddingVertical: spacing(0.75),
        paddingHorizontal: spacing(1.5),
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? colors.blue : 'transparent',
        marginRight: spacing(1),
      }}>
      <Text style={[fonts.secondary, { color: selected ? colors.blue : undefined }]}>{label}</Text>
    </Pressable>
  );
}
