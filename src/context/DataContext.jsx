import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc } from

'firebase/firestore';























const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real-time data from Firestore
  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setTopics([]);
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const qSubjects = query(collection(db, 'subjects'), where('userId', '==', user.id));
    const unsubSubjects = onSnapshot(qSubjects, (snapshot) => {
      setSubjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const qTopics = query(collection(db, 'topics'), where('userId', '==', user.id));
    const unsubTopics = onSnapshot(qTopics, (snapshot) => {
      setTopics(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const qTasks = query(collection(db, 'tasks'), where('userId', '==', user.id));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false); // Stop loading once tasks are fetched (assuming all fetch around the same time)
    });

    return () => {
      unsubSubjects();
      unsubTopics();
      unsubTasks();
    };
  }, [user]);

  // Actions
  const addSubject = useCallback(async (subject) => {
    if (!user) return;
    await addDoc(collection(db, 'subjects'), {
      ...subject,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
  }, [user]);

  const updateSubject = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'subjects', id), updates);
  }, []);

  const deleteSubject = useCallback(async (id) => {
    await deleteDoc(doc(db, 'subjects', id));
    // Note: In a production app, you'd use a Cloud Function or batched write to cascade delete topics and tasks.
    // Here, we rely on the client to clean up for simplicity of demonstration.
    topics.filter((t) => t.subjectId === id).forEach((t) => deleteDoc(doc(db, 'topics', t.id)));
    tasks.filter((t) => t.subjectId === id).forEach((t) => deleteDoc(doc(db, 'tasks', t.id)));
  }, [topics, tasks]);

  const addTopic = useCallback(async (topic) => {
    if (!user) return;
    await addDoc(collection(db, 'topics'), {
      ...topic,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
  }, [user]);

  const updateTopic = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'topics', id), updates);
  }, []);

  const deleteTopic = useCallback(async (id) => {
    await deleteDoc(doc(db, 'topics', id));
    tasks.filter((t) => t.topicId === id).forEach((t) => deleteDoc(doc(db, 'tasks', t.id)));
  }, [tasks]);

  const addTask = useCallback(async (task) => {
    if (!user) return;
    await addDoc(collection(db, 'tasks'), {
      ...task,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
  }, [user]);

  const updateTask = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'tasks', id), updates);
  }, []);

  const deleteTask = useCallback(async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  }, []);

  return (
    <DataContext.Provider
      value={{
        subjects, topics, tasks, isLoading,
        addSubject, updateSubject, deleteSubject,
        addTopic, updateTopic, deleteTopic,
        addTask, updateTask, deleteTask
      }}>
      
      {children}
    </DataContext.Provider>);

};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};