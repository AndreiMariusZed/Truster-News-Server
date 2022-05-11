import sys

from tensorflow.keras.preprocessing.sequence import pad_sequences

import keras
loaded_model = keras.models.load_model('D:/licenta/server/ai/modelul_meu_acc_99.hdf5')

maxlen = 1000
import pickle

with open('D:/licenta/server/ai/okenizer.hdf5', 'rb') as handle:
     tokenizer = pickle.load(handle)

x = [sys.argv[1]]
x = tokenizer.texts_to_sequences(x)
x = pad_sequences(x, maxlen=maxlen)

print((loaded_model.predict(x))[0][0])