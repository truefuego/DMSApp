import { useAuth } from '@/context/AuthContext';
import { getDocumentTags, uploadDocument } from '@/services/api';
import { formatToDDMMYYYY } from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Calendar, Camera, FileText, Tag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UploadScreen() {
    const { token, user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [documentDate, setDocumentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [majorHead, setMajorHead] = useState('');
    const [minorHead, setMinorHead] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const personalOptions = ['John', 'Tom', 'Emily', 'Sarah', 'David'];
    const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance', 'Marketing'];

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getDocumentTags('', token!);
                if (response.status) {
                    setAvailableTags(response.data.map((tag: any) => tag.id));
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, [token]);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                console.log(JSON.stringify(result.assets[0]));
                setSelectedFile(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const takePhoto = async () => {
        try {
          const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
          if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Camera permission is required to take photos');
            return;
          }
      
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          if (!result.canceled && result.assets && result.assets[0]) {
            const file = {
                mimeType: 'image/jpeg',
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || `photo-${Date.now()}.jpg`,
                size: result.assets[0].fileSize,
            }
            setSelectedFile(file);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to take photo');
        }
      };
      

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Alert.alert('Error', 'Please select a file');
            return;
        }

        if (!majorHead || !minorHead) {
        Alert.alert('Error', 'Please select both major and minor head');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType,
            } as any);

            const data = {
                major_head: majorHead,
                minor_head: minorHead,
                document_date: formatToDDMMYYYY(documentDate),
                document_remarks: remarks,
                tags: tags.map(tag => ({ tag_name: tag })),
                user_id: user.user_id
            };
            formData.append('data', JSON.stringify(data));

            const response = await uploadDocument(formData, token!);
            if (response.status) {
                Alert.alert('status', 'Document uploaded statusfully');
                // Reset form
                setSelectedFile(null);
                setMajorHead('');
                setMinorHead('');
                setTags([]);
                setRemarks('');
                setDocumentDate(new Date());
            } else {
                Alert.alert('Error', response.message || 'Failed to upload document');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Upload Document</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select File</Text>
                    <View style={styles.fileButtons}>
                        <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
                            <FileText size={24} color="#3b82f6" />
                            <Text style={styles.fileButtonText}>Choose File</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fileButton} onPress={takePhoto}>
                            <Camera size={24} color="#10b981" />
                            <Text style={styles.fileButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedFile && (
                        <Text style={styles.selectedFile}>Selected: {selectedFile.name}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Document Date</Text>
                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color="#6b7280" />
                        <Text style={styles.dateText}>{documentDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={documentDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setDocumentDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={majorHead}
                            onValueChange={(itemValue) => {
                                setMajorHead(itemValue);
                                setMinorHead('');
                            }}
                        >
                            <Picker.Item label="Select Category" value="" />
                            <Picker.Item label="Personal" value="Personal" />
                            <Picker.Item label="Professional" value="Professional" />
                        </Picker>
                    </View>
                </View>

                {majorHead && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sub-Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={minorHead}
                            onValueChange={(itemValue) => setMinorHead(itemValue)}
                        >
                            <Picker.Item label="Select Sub-Category" value="" />
                            {(majorHead === 'Personal' ? personalOptions : professionalOptions).map((option) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>
                </View>
                )}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>

                    <View style={styles.tagInputContainer}>
                        <TextInput
                            style={styles.tagInput}
                            placeholder="Add tag"
                            value={newTag}
                            onChangeText={setNewTag}
                            onSubmitEditing={addTag}
                        />
                        <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                            <Tag size={16} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginTop: 8, marginBottom: 8 }}
                    >
                        {availableTags
                            .filter(tag => !tags.includes(tag))
                            .map((tag, idx) => (
                                <TouchableOpacity
                                    key={tag + '-' + idx}
                                    style={styles.availableTag}
                                    onPress={() => {
                                        setTags([...tags, tag]);
                                    }}
                                >
                                    <Text style={styles.availableTagText}>+ {tag}</Text>
                                </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                        <TouchableOpacity
                            key={tag + '-' + index}
                            style={styles.tag}
                            onPress={() => removeTag(tag)}
                        >
                            <Text style={styles.tagText}>{tag}</Text>
                            <Text style={styles.tagRemove}>×</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Remarks</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter remarks..."
                        value={remarks}
                        onChangeText={setRemarks}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
                    onPress={handleUpload}
                    disabled={loading}
                >
                    <Text style={styles.uploadButtonText}>
                        {loading ? 'Uploading...' : 'Upload Document'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    form: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    fileButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    fileButton: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    fileButtonText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
    },
    selectedFile: {
        fontSize: 14,
        color: '#10b981',
        marginTop: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    dateText: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 8,
    },
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    tagInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    tagInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
    },
    addTagButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        padding: 8,
        margin: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#3b82f6',
        marginRight: 4,
    },
    tagRemove: {
        fontSize: 16,
        color: '#6b7280',
    },
    textArea: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 16,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    uploadButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    availableTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#6366f1',
    },
    availableTagText: {
        fontSize: 14,
        color: '#3730a3',
        fontWeight: '500',
    },  
});