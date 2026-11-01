import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
  };
}

export default function ApiTab() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        // Google Books API se real data fetch kar rahe hain
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10');
        setBooks(response.data.items || []);
      } catch (error) {
        // Network fail hone ki soorat mein secure fallback data
        setBooks([
          { id: '1', volumeInfo: { title: 'The Great Gatsby', authors: ['F. Scott Fitzgerald'] } },
          { id: '2', volumeInfo: { title: '1984', authors: ['George Orwell'] } },
          { id: '3', volumeInfo: { title: 'To Kill a Mockingbird', authors: ['Harper Lee'] } },
          { id: '4', volumeInfo: { title: 'Pride and Prejudice', authors: ['Jane Austen'] } },
          { id: '5', volumeInfo: { title: 'The Catcher in the Rye', authors: ['J.D. Salinger'] } },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌐 Global Digital Library</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0f766e" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📖 {item.volumeInfo.title}</Text>
              <Text style={styles.cardAuthor}>
                Author: {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0f766e', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  cardAuthor: { fontSize: 14, color: '#64748b' }
});