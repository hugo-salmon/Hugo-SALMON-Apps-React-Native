import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';

const CocktailDetails = ({ route }) => {
  const { idDrink, favorites, toggleFavorite } = route.params;
  const [cocktailDetails, setCocktailDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favorites.some(fav => fav.idDrink === idDrink));

  const handleToggleFavorite = () => {
    toggleFavorite(cocktailDetails);
    setIsFavorite(!isFavorite); 
  };

  useEffect(() => {
    const fetchCocktailDetails = async () => {
      try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
        const data = await response.json();
        if (data.drinks && data.drinks.length > 0) {
          setCocktailDetails(data.drinks[0]);
          setLoading(false);
        } else {
          setError(true);
          setLoading(true);
        }
      } catch (error) {
        console.error("Erreur dans l'extraction des détails du cocktail :", error);
        setError(true);
        setLoading(true);
      }
    };
    
    fetchCocktailDetails();
  }, [idDrink]);

  if (loading) {
    return(
      <View style={styles.centered}>
        <LottieView
          source={require('../assets/lottie/cocktail_loader.json')}
          autoPlay
          loop
          style={styles.lottieLoader}
        />
    </View>
    );
  }

  if (error) {
    return <Text>Erreur dans la récupération des détails du cocktail. Veuillez réessayer plus tard.</Text>;
  }

  if (!cocktailDetails) {
    return <Text>Détails non disponibles pour ce cocktail.</Text>;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>{cocktailDetails.strDrink}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteIcon}>
            <Icon name={isFavorite ? 'heart' : 'heart-o'} size={24} color="red" />
          </TouchableOpacity>
          <Image source={{ uri: cocktailDetails.strDrinkThumb }} style={styles.thumbnail} />
          <Text style={styles.subtitle}>Type de cocktail: {cocktailDetails.strAlcoholic}</Text>
          <Text style={styles.subtitle}>Ingrédients:</Text>
          <View style={styles.ingredientsContainer}>
            {renderIngredients(cocktailDetails)}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const renderIngredients = (cocktailDetails) => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktailDetails[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(
        <Text key={i} style={styles.ingredient}>
          {ingredient.trim()}
        </Text>
      );
    }
  }
  return ingredients;
};

const styles = StyleSheet.create({
  scrollView: {
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      paddingBottom: 50, 
    },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E2E2E', 
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F4F4F',
    marginTop: 10,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  thumbnail: {
    width: 320,
    height: 320,
    borderRadius: 160,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  ingredientsContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  ingredient: {
    fontSize: 17,
    color: '#3C3C3C',
    backgroundColor: '#EFEFEF', 
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    overflow: 'hidden', 
    textAlign: 'left',
  },
  favoriteIcon: {
    position: 'absolute', 
    top: 10, 
    right: 10, 
    padding: 8, 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lottieLoader: {
    width: 200,
    height: 200, 
  }
});

export default CocktailDetails;
