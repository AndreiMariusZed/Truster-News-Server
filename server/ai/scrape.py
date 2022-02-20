import sys
from newspaper import Article

article = Article(sys.argv[1])

article.download()
article.parse()

text = article.text
title = article.title

wholeText = title + ' ' + text

from tensorflow.keras.preprocessing.sequence import pad_sequences

import keras
loaded_model = keras.models.load_model('D:/licenta/server/ai/modelul_meu_acc_99.hdf5')

maxlen = 1000
import pickle

with open('D:/licenta/server/ai/okenizer.hdf5', 'rb') as handle:
     tokenizer = pickle.load(handle)

x = [wholeText]
x = tokenizer.texts_to_sequences(x)
x = pad_sequences(x, maxlen=maxlen)

print((loaded_model.predict(x))[0][0])
