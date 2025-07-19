import { useAuth } from '@/context/AuthContext';
import { searchDocuments } from '@/services/api';
import { formatToDDMMYYYY, isImage, isPdf } from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { Calendar, Download, Eye, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DocumentItem {
    document_id: number;
    document_date: string;
    document_remarks: string;
    file_url: string;
    major_head: string;
    minor_head: string;
    row_num?: number;
    total_count?: number;
    upload_time?: string;
    uploaded_by?: string;
    file_name: string;
}

export default function SearchScreen() {
    const { token } = useAuth();
    const [majorHead, setMajorHead] = useState('');
    const [minorHead, setMinorHead] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [tagsInput, setTagsInput] = useState('');
    const [searchResults, setSearchResults] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');

    // PDF
    const tempUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    // IMAGE
    // const tempUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/768px-React-icon.svg.png';
    
    const personalOptions = ['John', 'Tom', 'Emily', 'Sarah', 'David'];
    const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance', 'Marketing'];

    const handleSearch = async () => {
        setLoading(true);
        try {
            const tags = tagsInput.split(',').map(tag => ({ tag_name: tag.trim() })).filter(tag => tag.tag_name);
            
            const searchData = {
                major_head: majorHead,
                minor_head: minorHead,
                from_date: formatToDDMMYYYY(fromDate),
                to_date: formatToDDMMYYYY(toDate),
                tags: tags,
                uploaded_by: '',
                start: 0,
                length: 10,
                filterId: '',
                search: { value: '' }
            };

            const response = await searchDocuments(searchData, token!);
            if (response.status) {
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (fileUrl: string) => {
        try {
          if (isImage(fileUrl)) {
            setPreviewImageUrl(fileUrl);
            setImageModalVisible(true);
          } else if (isPdf(fileUrl)) {
            await WebBrowser.openBrowserAsync(fileUrl);
          } else {
            Alert.alert('Preview Not Available', 'Only image and PDF files can be previewed.');
          }
        } catch (error) {
          Alert.alert('Error', 'Could not preview file.');
        }
    };

    const handleDownload = async (fileUrl: string, fileName: string) => {
        try {
            const finalFileName = fileName || fileUrl.split('/').pop() || 'document';
            const fileUri = `${FileSystem.documentDirectory}${finalFileName}`;

            const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Downloaded', `File downloaded to ${uri}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not download file.');
        }
    };

    const renderDocument = ({ item }: { item: DocumentItem }) => {
        return (
            <View style={styles.documentItem} key={item.document_id}>
                <Text style={styles.documentName}>{item.file_name}</Text>
                <Text style={styles.documentInfo}>
                    {item.major_head} - {item.minor_head}
                </Text>
                <Text style={styles.documentDate}>{item.document_date}</Text>
                <Text style={styles.documentRemarks}>{item.document_remarks}</Text>
                <View style={styles.documentActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            // handlePreview(item.file_url)
                            handlePreview(tempUrl)
                        }}
                    >
                        <Eye size={16} color="#3b82f6" />
                        <Text style={styles.actionText}>Preview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDownload(item.file_url, item.file_name)}
                    >
                        <Download size={16} color="#10b981" />
                        <Text style={styles.actionText}>Download</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' is best for iOS, 'height' is safe for Android
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // adjust if you have a header
        >
            <ScrollView 
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Search Documents</Text>
                </View>

                <View style={styles.searchForm}>
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
                                <Picker.Item label="All Categories" value="" />
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
                                <Picker.Item label="All Sub-Categories" value="" />
                                {(majorHead === 'Personal' ? personalOptions : professionalOptions).map((option) => (
                                    <Picker.Item key={option} label={option} value={option} />
                                ))}
                            </Picker>
                        </View>
                    </View>)}

                        {/* Date Range */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Date Range</Text>
                        <View style={styles.dateContainer}>
                            <TouchableOpacity 
                                style={styles.dateButton}
                                onPress={() => setShowFromDatePicker(true)}
                            >
                                <Calendar size={16} color="#6b7280" />
                                <Text style={styles.dateText}>From: {fromDate.toDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dateButton}
                                onPress={() => setShowToDatePicker(true)}
                            >
                                <Calendar size={16} color="#6b7280" />
                                <Text style={styles.dateText}>To: {toDate.toDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {showFromDatePicker && (
                            <DateTimePicker
                                value={fromDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowFromDatePicker(false);
                                    if (selectedDate) {
                                    setFromDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                        
                        {showToDatePicker && (
                            <DateTimePicker
                                value={toDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowToDatePicker(false);
                                    if (selectedDate) {
                                    setToDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tags</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter tags separated by commas"
                            value={tagsInput}
                            onChangeText={setTagsInput}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
                        onPress={handleSearch}
                        disabled={loading}
                    >
                        <Search size={20} color="#ffffff" />
                        <Text style={styles.searchButtonText}>
                            {loading ? 'Searching...' : 'Search Documents'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {searchResults.length > 0 && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsTitle}>Search Results ({searchResults.length})</Text>
                        <FlatList
                            data={searchResults}
                            renderItem={renderDocument}
                            keyExtractor={item => String(item?.document_id)}
                            scrollEnabled={true}
                        />
                    </View>
                )}

                {imageModalVisible && (
                    <Modal
                        visible={imageModalVisible}
                        transparent
                        onRequestClose={() => setImageModalVisible(false)}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.95)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => setImageModalVisible(false)}
                            activeOpacity={1}
                        >
                            <Image
                                source={{ uri: previewImageUrl }}
                                style={{ width: '90%', height: '70%', resizeMode: 'contain' }}
                            />
                            <Text style={{ color: '#fff', marginTop: 16 }}>Tap anywhere to close</Text>
                        </TouchableOpacity>
                    </Modal>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
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
    searchForm: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    dateContainer: {
        gap: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    dateText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 16,
        fontSize: 16,
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
    },
    searchButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    searchButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    resultsContainer: {
        padding: 20,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    documentItem: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    documentInfo: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    documentDate: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 8,
    },
    documentRemarks: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
    },
    documentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        padding: 8,
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 12,
        color: '#374151',
        marginLeft: 4,
    },
});