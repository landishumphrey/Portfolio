#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os


# In[2]:


# data_folder = r"C:\Users\kingo\DAT_210_Spring24\Data"


# In[3]:


def access(data_folder, filename):
    path = os.path.join(data_folder, filename)
    if os.path.isfile(path):
        return path

