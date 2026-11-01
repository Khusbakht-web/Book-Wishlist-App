import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Book {
  id: string;
  title: string;
  author: string;
}

export default function BookWishlistScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('@book_wishlist');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveBooks = async (updatedBooks: Book[]) => {
    try {
      await AsyncStorage.setItem('@book_wishlist', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrUpdate = () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Error', 'Please enter both book title and author!');
      return;
    }

    if (editId) {
      // Update existing book
      const updated = books.map((item) =>
        item.id === editId ? { ...item, title, author } : item
      );
      setBooks(updated);
      saveBooks(updated);
      setEditId(null);
    } else {
      // Add new book
      const newBook: Book = {
        id: Date.now().toString(),
        title,
        author,
      };
      const updated = [newBook, ...books];
      setBooks(updated);
      saveBooks(updated);
    }

    setTitle('');
    setAuthor('');
  };

  const handleEdit = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditId(book.id);
  };

  const handleDelete = (id: string) => {
    const updated = books.filter((item) => item.id !== id);
    setBooks(updated);
    saveBooks(updated);
  };

  // Search and filter using filter() array method
  const filteredBooks = books.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Book Wishlist & Library</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by book title or author..."
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Input Fields for Add/Update */}
      <TextInput
        style={styles.input}
        placeholder="Enter book title"
        placeholderTextColor="#94a3b8"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter author name"
        placeholderTextColor="#94a3b8"
        value={author}
        onChangeText={setAuthor}
      />

      <Pressable style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editId ? 'Update Book' : 'Add to Wishlist'}
        </Text>
      </Pressable>

      {/* List of Books */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>📖 {item.title}</Text>
              <Text style={styles.cardAuthor}>By: {item.author}</Text>
            </View>
            <View style={styles.actionContainer}>
              <Pressable onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0f766e', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 10, fontSize: 15 },
  button: { backgroundColor: '#0f766e', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  cardAuthor: { fontSize: 13, color: '#64748b', marginTop: 3 },
  actionContainer: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#0284c7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});