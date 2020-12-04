import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  previous_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const { user, updateUser } = useAuth();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name empty'),
          email: Yup.string().required('E-mail empty').email('E-mail invalid'),
          previous_password: Yup.string(),
          password: Yup.string().when('previous_password', {
            is: val => !!val.length,
            then: Yup.string()
              .min(6, 'Password invalid')
              .required('Password empty'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('previous_password', {
              is: val => !!val.length,
              then: Yup.string()
                .min(6, 'Password invalid')
                .required('Password empty'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          previous_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(previous_password
            ? { previous_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Success update user profile',
          description: 'User profile updated',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: 'Error Update User Profile',
          description: 'Error update user profile, try again',
        });
      }
    },
    [updateUser, addToast, history],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Success update user avatar',
            description: 'User avatar updated',
          });
        });
      }
    },
    [updateUser, addToast],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{ name: user.name, email: user.email }}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Profile</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="previous_password"
            icon={FiLock}
            type="password"
            placeholder="Previous password"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Password confirmation"
          />

          <Button type="submit">Save</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
