import sys

from tensorflow.keras.preprocessing.sequence import pad_sequences

import keras
print('de aici')
loaded_model = keras.models.load_model('modelul_meu_acc_99.hdf5')

maxlen = 1000
import pickle

with open('./okenizer.hdf5', 'rb') as handle:
     tokenizer = pickle.load(handle)

x = [' The head of a conservative Republican faction in the U.S. Congress, who voted this month for a huge expansion of the national debt to pay for tax cuts, called himself a “fiscal conservative” on Sunday and urged budget restraint in 2018. In keeping with a sharp pivot under way among Republicans, U.S. Representative Mark Meadows, speaking on CBS’ “Face the Nation,” drew a hard line on federal spending, which lawmakers are bracing to do battle over in January. When they return from the holidays on Wednesday, lawmakers will begin trying to pass a federal budget in a fight likely to be linked to other issues, such as immigration policy, even as the November congressional election campaigns approach in which Republicans will seek to keep control of Congress. President Donald Trump and his Republicans want a big budget increase in military spending, while Democrats also want proportional increases for non-defense “discretionary” spending on programs that support education, scientific research, infrastructure, public health and environmental protection.']
x = tokenizer.texts_to_sequences(x)
x = pad_sequences(x, maxlen=maxlen)
# print(x)
print((loaded_model.predict(x) > 0.5)[0][0])



# print('true')