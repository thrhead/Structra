import { Audio } from "expo-av";
import { Loader2, Mic, Play, Square, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { useAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

const VoiceRecorder = ({
	onRecordingComplete,
	existingAudioUrl = null,
	onDelete,
}) => {
	const { theme } = useTheme();
	const { showAlert } = useAlert();
	const [recording, setRecording] = useState();
	const [permissionResponse, requestPermission] = Audio.usePermissions();
	const [audioUri, setAudioUri] = useState(existingAudioUrl);
	const [isPlaying, setIsPlaying] = useState(false);
	const [sound, setSound] = useState();
	const [_duration, _setDuration] = useState(0);

	useEffect(() => {
		return () => {
			if (recording) {
				recording.stopAndUnloadAsync();
			}
			if (sound) {
				sound.unloadAsync();
			}
		};
	}, [sound.unloadAsync, sound, recording.stopAndUnloadAsync, recording]);

	async function startRecording() {
		try {
			if (permissionResponse.status !== "granted") {
				await requestPermission();
			}
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			const { recording } = await Audio.Recording.createAsync(
				Audio.RecordingOptionsPresets.HIGH_QUALITY,
			);
			setRecording(recording);
		} catch (err) {
			console.error("Failed to start recording", err);
			showAlert("Hata", "Ses kaydı başlatılamadı.", [], "error");
		}
	}

	async function stopRecording() {
		setRecording(undefined);
		await recording.stopAndUnloadAsync();
		const uri = recording.getURI();
		setAudioUri(uri);
		if (onRecordingComplete) {
			onRecordingComplete(uri);
		}
	}

	async function playSound() {
		if (!audioUri) return;

		try {
			const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
			setSound(sound);

			await sound.playAsync();
			setIsPlaying(true);

			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.didJustFinish) {
					setIsPlaying(false);
				}
			});
		} catch (_error) {
			showAlert("Hata", "Ses dosyası oynatılamadı.", [], "error");
		}
	}

	async function deleteRecording() {
		setAudioUri(null);
		if (onDelete) onDelete();
	}

	const styles = getStyles(theme);

	if (audioUri) {
		return (
			<View style={styles.container}>
				<View style={styles.playbackContainer}>
					<Pressable onPress={playSound} style={styles.iconButton}>
						{isPlaying ? (
							<Loader2 size={24} color={COLORS.primary} />
						) : (
							<Play size={24} color={COLORS.primary} fill={COLORS.primary} />
						)}
					</Pressable>
					<Text style={styles.statusText}>Ses Kaydı</Text>
					<Pressable onPress={deleteRecording} style={styles.deleteButton}>
						<Trash2 size={20} color={COLORS.error} />
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Pressable
				onPress={recording ? stopRecording : startRecording}
				style={[
					styles.recordButton,
					recording ? styles.recordingActive : styles.recordingInactive,
				]}
			>
				{recording ? (
					<Square size={24} color="#FFF" fill="#FFF" />
				) : (
					<Mic size={24} color="#FFF" />
				)}
				<Text style={styles.buttonText}>
					{recording ? "Durdur" : "Ses Kaydı Başlat"}
				</Text>
			</Pressable>
		</View>
	);
};

const getStyles = (theme) =>
	StyleSheet.create({
		container: {
			marginVertical: 10,
		},
		recordButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			padding: 12,
			borderRadius: 8,
			gap: 10,
		},
		recordingInactive: {
			backgroundColor: COLORS.primary,
		},
		recordingActive: {
			backgroundColor: COLORS.error,
		},
		buttonText: {
			color: "#FFF",
			fontWeight: "bold",
			fontSize: 16,
		},
		playbackContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: theme.colors.card,
			padding: 12,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: theme.colors.border,
			gap: 12,
		},
		statusText: {
			flex: 1,
			color: theme.colors.text,
			fontSize: 14,
		},
		iconButton: {
			padding: 4,
		},
		deleteButton: {
			padding: 4,
		},
	});

export default VoiceRecorder;
