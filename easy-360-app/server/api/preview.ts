export default defineEventHandler((event) => {

    const { id } = getQuery(event)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
          })
    }

    return {
      hello: `Hello ${id}`
    }
  })