import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Search, Upload } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Document Management</Text>
                <Text style={styles.subtitle}>Manage your documents efficiently</Text>
            </View>

            <View style={styles.quickActions}>
                <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/upload')}
                >
                <Upload size={32} color="#3b82f6" />
                    <Text style={styles.actionTitle}>Upload Document</Text>
                    <Text style={styles.actionSubtitle}>Add new documents</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/search')}
                >
                <Search size={32} color="#10b981" />
                    <Text style={styles.actionTitle}>Search Documents</Text>
                    <Text style={styles.actionSubtitle}>Find your documents</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginTop: 12,
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
        textAlign: 'center',
    },
    features: {
        padding: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    featureText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 12,
    },
});