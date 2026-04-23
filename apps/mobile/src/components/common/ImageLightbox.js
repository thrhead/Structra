import { MaterialIcons } from "@expo/vector-icons";
import {
	Dimensions,
	Image,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ImageLightbox = ({ visible, imageUrl, onClose }) => {
	if (!imageUrl) return null;

	return (
		<Modal
			visible={visible}
			transparent={true}
			onRequestClose={onClose}
			animationType="fade"
		>
			<View style={styles.container}>
				<TouchableOpacity style={styles.closeButton} onPress={onClose}>
					<MaterialIcons name="close" size={30} color="white" />
				</TouchableOpacity>

				<Image
					source={{ uri: imageUrl }}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	closeButton: {
		position: "absolute",
		top: 50,
		right: 20,
		zIndex: 1,
		padding: 10,
	},
	image: {
		width: width,
		height: height * 0.8,
	},
});

export default ImageLightbox;
