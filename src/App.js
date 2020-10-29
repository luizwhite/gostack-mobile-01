import React, { useEffect, useState } from 'react';
// import { v4 as uuid } from 'uuid';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import api from './services/api';

export default function App() {
  const repo1 = {
    title: 'Front-end com ReactJS',
    url: 'https://github.com/luizwhite/gostack-frontend',
    techs: ['JavaScript', 'ReactJS', 'HTML5', 'CSS3'],
  };
  const repo2 = {
    title: 'Mobile com React Native',
    url: 'https://github.com/luizwhite/gostack-mobile',
    techs: ['JavaScript', 'React Native', 'HTML5', 'CSS3'],
  };
  const [repos, setRepos] = useState([]);

  async function handleLikeRepository(id) {
    console.log(id);
    const res = await api.post(`repositories/${id}/like`);
    const repoLiked = res.data;
    setRepos([...repos.filter((repo) => repo.id !== id), repoLiked]);
  }

  useEffect(() => {
    async function setAndLoadRepos() {
      await api
        .post('repositories', repo1)
        .catch((err) => console.log(JSON.stringify(err.response.data.error)));
      await api
        .post('repositories', repo2)
        .catch((err) => console.log(JSON.stringify(err.response.data.error)));
      await api.get('repositories').then((res) => {
        setRepos(res.data);
      });
    }

    setAndLoadRepos();
  }, []);

  useEffect(() => {
    console.log(repos);
  }, [repos]);

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='#7159c1' />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repos}
          keyExtractor={(repo) => repo.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repo.title}</Text>

              <View style={styles.techsContainer}>
                {repo.techs.length > 0 &&
                  repo.techs.map((tech) => (
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {(repo.likes > 1 || repo.likes === 0) &&
                    `${repo.likes} curtidas`}
                  {repo.likes === 1 && `${repo.likes} curtida`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                testID={`like-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
  },
});
