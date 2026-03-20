import pandas as pd
import pickle


# ---------------------------------------------------
# Collaborative Recommender Class
# ---------------------------------------------------
class CollaborativeRecommender:

    def __init__(self, model):
        self.model = model

    def predict(self, user, item):
        return self.model.predict(user, item)

    @staticmethod
    def load(path):
        with open(path, "rb") as f:
            return pickle.load(f)


# ---------------------------------------------------
# Content Based Recommender
# ---------------------------------------------------
class ContentBasedRecommender:

    def __init__(self, vectorizer=None, matrix=None, products=None):
        self.vectorizer = vectorizer
        self.matrix = matrix
        self.products = products

    def recommend(self, product_id, top_n=10):

        if self.products is None:
            return []

        try:
            idx = self.products.index(product_id)
        except:
            return []

        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity

        scores = cosine_similarity(
            self.matrix[idx],
            self.matrix
        ).flatten()

        ranked = scores.argsort()[::-1]

        results = []

        for i in ranked[1:top_n+1]:
            results.append(self.products[i])

        return results

    @staticmethod
    def load(path):
        with open(path, "rb") as f:
            return pickle.load(f)


# ---------------------------------------------------
# Load Dataset
# ---------------------------------------------------
def load_data(path):

    df = pd.read_csv(path)

    df = df.rename(columns={
        "User_ID": "UserId",
        "Product_Category_Preference": "ProductId"
    })

    df["Score"] = df["Purchase_Frequency"]

    return df


# ---------------------------------------------------
# Load Models
# ---------------------------------------------------
def load_models():

    with open("recommendation\svd_model.pkl", "rb") as f:
        svd_model = pickle.load(f)

    with open("recommendation\tfidf_model.pkl", "rb") as f:
        tfidf_model = pickle.load(f)

    return svd_model, tfidf_model


# ---------------------------------------------------
# Hybrid Recommendation
# ---------------------------------------------------
def hybrid_recommend(user_id, product_id, df, svd_model, tfidf_model, top_n=10):

    cf_scores = []

    for item in df["ProductId"].unique():

        try:
            pred = svd_model.predict(user_id, item).est
        except:
            pred = 0

        cf_scores.append((item, pred))

    cf_scores = sorted(cf_scores, key=lambda x: x[1], reverse=True)

    cf_top = [i[0] for i in cf_scores[:top_n]]

    try:
        content_top = tfidf_model.recommend(product_id, top_n)
    except:
        content_top = []

    combined = list(dict.fromkeys(cf_top + content_top))

    return combined[:top_n]


# ---------------------------------------------------
# Main Recommendation Function
# ---------------------------------------------------
def recommend_products(user_id, product_id):

    df = load_data("recommendation\user_personalized_features.csv")

    svd_model, tfidf_model = load_models()

    recommendations = hybrid_recommend(
        user_id,
        product_id,
        df,
        svd_model,
        tfidf_model
    )

    return recommendations


# ---------------------------------------------------
# Run Example
# ---------------------------------------------------
if __name__ == "__main__":

    user_id = "U100"
    product_id = "Electronics"

    results = recommend_products(user_id, product_id)

    print("\nRecommended Products:\n")

    for r in results:
        print(r)